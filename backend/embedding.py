import sys, json, base64, tempfile, os

# suppress tensorflow logs before import
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from deepface import DeepFace

data = json.load(sys.stdin)
b64 = data['image'].split(',')[1] # get the base64 data by getting rid of the headers
tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
tmp.write(base64.b64decode(b64))
tmp.close()

try:
    result = DeepFace.represent(img_path=tmp.name, model_name='Facenet', enforce_detection=True)
    print(json.dumps(result[0]['embedding']))
except Exception as e:
    print(json.dumps({'error': str(e)}))
finally:
    os.unlink(tmp.name)