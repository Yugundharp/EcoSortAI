"""
EcoSortAI Model Training Script
Trains a CNN for waste classification
"""
import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
from PIL import Image
import glob

# Configuration
IMAGE_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 20
NUM_CLASSES = 5
CLASSES = ["Paper", "Plastic", "Metal", "Glass", "Compost"]
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "models", "recycler_cnn.h5")
METRICS_SAVE_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "metrics.json")


def load_dataset(data_dir: str):
    """
    Load dataset from directory structure:
    data_dir/
      ├── Paper/
      ├── Plastic/
      ├── Metal/
      ├── Glass/
      └── Compost/
    
    Args:
        data_dir: Path to dataset directory
        
    Returns:
        X: Image arrays
        y: Labels
    """
    X = []
    y = []
    
    print("Loading dataset...")
    for class_idx, class_name in enumerate(CLASSES):
        class_dir = os.path.join(data_dir, class_name)
        if not os.path.exists(class_dir):
            print(f"Warning: {class_dir} not found. Skipping {class_name}.")
            continue
        
        image_files = glob.glob(os.path.join(class_dir, "*.jpg")) + \
                     glob.glob(os.path.join(class_dir, "*.png")) + \
                     glob.glob(os.path.join(class_dir, "*.jpeg"))
        
        print(f"Found {len(image_files)} images in {class_name}")
        
        for img_path in image_files:
            try:
                img = Image.open(img_path)
                img = img.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img_array = np.array(img, dtype=np.float32) / 255.0
                X.append(img_array)
                y.append(class_idx)
            except Exception as e:
                print(f"Error loading {img_path}: {e}")
                continue
    
    X = np.array(X)
    y = np.array(y)
    
    print(f"Loaded {len(X)} images total")
    return X, y


def build_model():
    """
    Build CNN model architecture
    
    Returns:
        Compiled Keras model
    """
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=(*IMAGE_SIZE, 3)),
        
        # Convolutional layers
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Flatten and dense layers
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(NUM_CLASSES, activation='softmax'),
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def train():
    """
    Main training function
    """
    # Dataset path - update this to your dataset location
    # You can use TrashNet or Toronto Waste dataset
    data_dir = input("Enter path to dataset directory (or press Enter for default './data'): ").strip()
    if not data_dir:
        data_dir = "./data"
    
    if not os.path.exists(data_dir):
        print(f"Error: Dataset directory '{data_dir}' not found.")
        print("Please download a waste classification dataset (e.g., TrashNet) and organize it as:")
        print("  data/")
        print("    ├── Paper/")
        print("    ├── Plastic/")
        print("    ├── Metal/")
        print("    ├── Glass/")
        print("    └── Compost/")
        return
    
    # Load dataset
    X, y = load_dataset(data_dir)
    
    if len(X) == 0:
        print("Error: No images found in dataset.")
        return
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Build model
    print("\nBuilding model...")
    model = build_model()
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        keras.callbacks.ModelCheckpoint(
            MODEL_SAVE_PATH,
            save_best_only=True,
            monitor='val_accuracy'
        ),
    ]
    
    # Train
    print("\nTraining model...")
    history = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_split=0.2,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("\nEvaluating model...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test Accuracy: {test_accuracy:.4f}")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Predictions for confusion matrix
    y_pred = model.predict(X_test, verbose=0)
    y_pred_classes = np.argmax(y_pred, axis=1)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred_classes)
    print("\nConfusion Matrix:")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred_classes, target_names=CLASSES))
    
    # Prepare metrics data
    training_history = []
    for i in range(len(history.history['accuracy'])):
        training_history.append({
            "epoch": i + 1,
            "accuracy": float(history.history['accuracy'][i]),
            "loss": float(history.history['loss'][i]),
            "val_accuracy": float(history.history['val_accuracy'][i]),
            "val_loss": float(history.history['val_loss'][i]),
        })
    
    metrics_data = {
        "accuracy": float(test_accuracy),
        "loss": float(test_loss),
        "confusionMatrix": {
            "labels": CLASSES,
            "data": cm.tolist(),
        },
        "trainingHistory": training_history,
    }
    
    # Save metrics
    os.makedirs(os.path.dirname(METRICS_SAVE_PATH), exist_ok=True)
    with open(METRICS_SAVE_PATH, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"\nMetrics saved to {METRICS_SAVE_PATH}")
    
    # Save model
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")
    
    print("\nTraining completed!")


if __name__ == "__main__":
    train()

