from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

CORS(app)

model = tf.keras.models.load_model("model/crop_model.h5")

class_names = [
    "Potato Early Blight",
    "Potato Late Blight",
    "Potato Healthy",
    "Tomato Leaf Mold",
    "Tomato Healthy"
]

def prepare_image(image):

    image = image.resize((224,224))

    image = np.array(image)

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    return image

@app.route("/predict", methods=["POST"])

def predict():

    file = request.files["file"]

    image = Image.open(file).convert("RGB")

    processed = prepare_image(image)

    prediction = model.predict(processed)

    predicted_class = class_names[np.argmax(prediction)]

    confidence = float(np.max(prediction) * 100)

    return jsonify({
        "prediction": predicted_class,
        "confidence": round(confidence,2)
    })

if __name__ == "__main__":
    app.run(debug=True)