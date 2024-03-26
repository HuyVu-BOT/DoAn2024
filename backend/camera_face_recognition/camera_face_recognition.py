import face_recognition
import cv2
import numpy as np
from schemas.employee_faces import EmployeeFaces
from schemas.employees import Employees
from schemas.cameras import Cameras
from schemas.recognition_logs import RecognitionLogs
from config.db import Session
from sqlalchemy import select
import time
from datetime import datetime
import threading
from config.exception import CustomException
from config.env import settings

lock = threading.Lock()

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
        with Session.begin() as session:
            existed_camera = session.execute(select(Cameras).filter_by(id=self._camera_id)).scalars().one()
            self._camera_url = existed_camera.url
            print("camera_url: ", self._camera_url)
            # self._video_capture = cv2.VideoCapture(camera_url)
            self._video_capture = cv2.VideoCapture(0)
            if not self._video_capture.isOpened():
                raise CustomException(status_code=400, detail="Camera URL không hợp lệ hoặc không thể mở.")

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
            vector = np.frombuffer(employee_face_dict["vector"], dtype=np.uint8)
            self._known_face_encodings.append(vector)
            self._known_employee_ids.append(employee_id)
        print("a")
        self._thread = threading.Thread(target=self.run, args=())
        print("b")
        self._thread.start()
        print("c")

    def stop(self):
        self._is_stopped = True
        self._thread.join()

    def run(self):
        # Get a reference to webcam #0 (the default one)
        # Load a sample picture and learn how to recognize it.
        # obama_image = face_recognition.load_image_file("obama.jpg")
        # obama_face_encoding = face_recognition.face_encodings(obama_image)[0]

        # # Load a second sample picture and learn how to recognize it.
        # biden_image = face_recognition.load_image_file("biden.jpg")
        # biden_face_encoding = face_recognition.face_encodings(biden_image)[0]

        # Create arrays of known face encodings and their names
        # known_face_encodings = [
        #     obama_face_encoding,
        #     biden_face_encoding
        # ]
        # known_face_names = [
        #     "Barack Obama",
        #     "Joe Biden"
        # ]

        # Initialize some variables
        face_locations = []
        face_encodings = []
        face_names = []
        process_this_frame = True

        print('1')
        # cv2.namedWindow(self._camera_url, cv2.WINDOW_NORMAL)
        with lock:
            cv2.namedWindow("test", cv2.WINDOW_NORMAL)
        while not self._is_stopped:
            # Grab a single frame of video
            ret, frame = self._video_capture.read()

            print('2')
            # Only process every other frame of video to save time
            if process_this_frame:
                # Resize frame of video to 1/4 size for faster face recognition processing
                # small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                small_frame = frame

                # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                rgb_small_frame = small_frame[:, :, ::-1]
                
                print('3')
                # Find all the faces and face encodings in the current frame of video
                face_locations = face_recognition.face_locations(rgb_small_frame)
                print('4')
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
                print('5')

                face_names = []
                for face_encoding in face_encodings:
                    # See if the face is a match for the known face(s)
                    matches = face_recognition.compare_faces(self._known_face_encodings, face_encoding)
                    employee_id = "unknown"

                    # # If a match was found in known_face_encodings, just use the first one.
                    # if True in matches:
                    #     first_match_index = matches.index(True)
                    #     name = known_face_names[first_match_index]
                    print('6')
                    # Or instead, use the known face with the smallest distance to the new face
                    face_distances = face_recognition.face_distance(self._known_face_encodings, face_encoding)
                    print('7')
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        employee_id = self._known_employee_ids[best_match_index]
                        now = time.time()
                        if (now - self._last_time_by_id[employee_id] > self._interval_thresh):
                            print('8')
                            with Session.begin() as session:
                                current_dt = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                                print("current_dt: ", current_dt)
                                new_log = RecognitionLogs(employee_id=employee_id, camera_id=self._camera_id, datetime=current_dt)
                                session.add(new_log)
                            print('9')
                            self._last_time_by_id[employee_id] = now

                    face_names.append(self._employee_id_to_name[employee_id])

            process_this_frame = not process_this_frame


            print('10')
            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            print('11')
            # Display the resulting image
            f_w, f_h, c = frame.shape
            ratio = self._max_output_frame_width / f_w if self._max_output_frame_width < f_w else 1
            new_w = int(f_w * ratio)
            new_h = int(f_h * ratio)
            small_frame = cv2.resize(frame, (new_w, new_h))
            with lock:
                cv2.imshow("test", small_frame)
                # cv2.imshow(self._camera_url, small_frame)

                # if cv2.waitKey(30):
                #     break
                # Hit 'q' on the keyboard to quit!
                # if cv2.waitKey(30) & 0xFF == ord('q'):
                #     break
            print('12')

        # Release handle to the webcam
        self._video_capture.release()
        cv2.destroyAllWindows()
        print('13')
