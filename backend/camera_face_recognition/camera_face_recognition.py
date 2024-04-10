import face_recognition
import cv2
import numpy as np
from schemas.employee_faces import EmployeeFaces
from schemas.employees import Employees
from schemas.recognition_logs import RecognitionLogs
from config.db import Session
from sqlalchemy import select
import time
from datetime import datetime
import pickle

class CameraFaceRecognition:
    def __init__(self, camera_id: int):
        self._camera_id = camera_id
        self._is_stopped = False
        self._known_face_encodings = []
        self._known_employee_ids = []
        self._employee_id_to_name = {"unknown": "Unknown"}
        self._interval_thresh = 30
        self._last_time_by_id = {}
        self._video_capture = None
        self._camera_url = ""
        self._max_output_frame_width = 1280
        self._video_capture = cv2.VideoCapture(0)
        if not self._video_capture.isOpened():
            raise Exception("Camera URL không hợp lệ hoặc không thể mở.")

        with Session.begin() as session:
            statement = select(EmployeeFaces)
            all_employee_faces = session.execute(statement).scalars().all()
            all_employee_faces = [e_faces.to_dict() for e_faces in all_employee_faces]
        for employee_face_dict in all_employee_faces:
            employee_id = employee_face_dict["employee_id"]
            if employee_id in self._employee_id_to_name:
                employee_name = self._employee_id_to_name[employee_id]
            else:
                with Session.begin() as session:
                    existed_employee = session.execute(select(Employees).filter_by(id=employee_id)).scalars().one()
                    employee_name = existed_employee.full_name
                self._employee_id_to_name[employee_id] = employee_name
            vector = pickle.loads(employee_face_dict["vector"])
            self._known_face_encodings.append(vector)
            self._known_employee_ids.append(employee_id)
        if (len(self._known_face_encodings) == 0):
            print("Không có khuôn mặt nào được đăng ký!")

    def run(self):
        # Initialize some variables
        face_locations = []
        face_encodings = []
        face_names = []
        process_this_frame = True
        print("self._known_face_encodings: ", self._employee_id_to_name)
        scale = 0.5
        while True:
            # Grab a single frame of video
            ret, frame = self._video_capture.read()

            # Only process every other frame of video to save time
            if process_this_frame:
                # Resize frame of video to 1/4 size for faster face recognition processing
                small_frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
                # small_frame = frame

                # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])
                
                # Find all the faces and face encodings in the current frame of video
                face_locations = face_recognition.face_locations(rgb_small_frame)
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                face_names = []
                for face_encoding in face_encodings:
                    # See if the face is a match for the known face(s)

                    matches = face_recognition.compare_faces(self._known_face_encodings, face_encoding, tolerance=0.45)
                    employee_id = "unknown"
                    if(len(self._known_face_encodings) == 0):
                        face_names.append(self._employee_id_to_name[employee_id])
                        continue
                    # # If a match was found in known_face_encodings, just use the first one.
                    # if True in matches:
                    #     first_match_index = matches.index(True)
                    #     name = known_face_names[first_match_index]
                    # Or instead, use the known face with the smallest distance to the new face
                    face_distances = face_recognition.face_distance(self._known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                    # if face_distances[best_match_index] < 0.4:
                        employee_id = self._known_employee_ids[best_match_index]
                        now = time.time()
                        if not employee_id in self._last_time_by_id or (now - self._last_time_by_id[employee_id] > self._interval_thresh):
                            with Session.begin() as session:
                                current_dt = datetime.now()
                                print("current_dt: ", current_dt.strftime("%d/%m/%Y %H:%M:%S"))
                                new_log = RecognitionLogs(employee_id=employee_id, camera_name=self._camera_id, datetime=current_dt)
                                session.add(new_log)
                            self._last_time_by_id[employee_id] = now

                    face_names.append(self._employee_id_to_name[employee_id])

            process_this_frame = not process_this_frame


            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top = int(top / scale)
                right = int(right/scale)
                bottom = int(bottom/scale)
                left = int(left/scale)

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            # Display the resulting image
            cv2.imshow("output", frame)

            # Hit 'q' on the keyboard to quit!
            if cv2.waitKey(30) & 0xFF == ord('q'):
                break

        # Release handle to the webcam
        self._video_capture.release()
        cv2.destroyAllWindows()
