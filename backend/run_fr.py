from camera_face_recognition.camera_face_recognition import CameraFaceRecognition
import sys
from config.db import Base, engine

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Hãy nhập tên camera!")
    else:
        Base.metadata.create_all(engine)
        new_instance = CameraFaceRecognition(sys.argv[1])
        new_instance.run()
