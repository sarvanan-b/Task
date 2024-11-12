import torch
import torch.nn as nn
import re
from nltk.corpus import stopwords
import dateparser
from datetime import datetime, timedelta
import pickle
import sys

priority_mapping = {0: 'normal', 1: 'medium', 2: 'high'}

# Load the model and vocabulary
class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim):
        super(LSTMClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        x = self.embedding(x)
        _, (hidden, _) = self.lstm(x)
        x = self.fc(hidden[-1])
        return x

try:
    # Load vocabulary and model
    with open("D:\\Academics\\SEM 5\\SDE\\Taskmanager\\server\\models\\ml\\vocab.pkl", "rb") as f:
        vocab = pickle.load(f)

    model = LSTMClassifier(len(vocab) + 1, 50, 32, 3)
    model.load_state_dict(torch.load("D:\\Academics\\SEM 5\\SDE\\Taskmanager\\server\\models\\ml\\task_priority_model.pth", weights_only=True))

except FileNotFoundError as e:
    print(f"Error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"Unexpected error while loading the model or vocabulary: {e}")
    sys.exit(1)

# Function to preprocess text
def preprocess_text(text):
    try:
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        text = ' '.join([word for word in text.split() if word not in stopwords.words('english')])
        return text
    except Exception as e:
        print(f"Error in preprocessing text: {e}")
        return ""

# Function to encode text
def encode_text(text):
    try:
        return [vocab.get(word, 0) for word in text.split()]
    except Exception as e:
        print(f"Error in encoding text: {e}")
        return []

# Function to classify priority based on deadline
def classify_deadline_priority(description):
    try:
        date_parsed = dateparser.parse(description)
        if not date_parsed:
            return None
        
        today = datetime.today()
        delta = date_parsed - today
        
        if delta <= timedelta(days=1):
            return "High"
        elif timedelta(days=2) <= delta <= timedelta(days=7):
            return "Medium"
        else:
            return "Low"
    except Exception as e:
        print(f"Error in classifying deadline priority: {e}")
        return None

# Function to predict priority
def predict_priority(description):
    try:
        # Attempt deadline-based classification first
        deadline_priority = classify_deadline_priority(description)
        if deadline_priority:
            return deadline_priority
        
        # Preprocess and encode the description
        description = preprocess_text(description)
        encoded = encode_text(description)
        
        if not encoded:
            print("Error: Encoded text is empty. Unable to make prediction.")
            return "Unknown"
        
        # Pad or truncate the encoded text to fit the model input
        padded = encoded + [0] * (10 - len(encoded)) if len(encoded) < 10 else encoded[:10]
        
        # Perform prediction with the model
        with torch.no_grad():
            output = model(torch.tensor([padded]))
            _, predicted = torch.max(output, 1)
        
        return priority_mapping.get(predicted.item(), "Unknown")
    
    except Exception as e:
        print(f"Error in predicting priority: {e}")
        return "Unknown"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No description provided.")
        sys.exit(1)

    
    description = sys.argv[1]
    # description = "learn for future projects"
    priority = predict_priority(description)
    print(priority)


