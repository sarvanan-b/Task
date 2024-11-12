import sys
import pickle
import pandas as pd
from datetime import datetime
from sklearn.preprocessing import LabelEncoder
from sklearn.base import BaseEstimator, TransformerMixin

# Optional: If ColumnSelector is not needed, you can remove it
class ColumnSelector(BaseEstimator, TransformerMixin):
    def __init__(self, column_name):
        self.column_name = column_name

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X[self.column_name] if self.column_name == 'description' else X[[self.column_name]]

# Load the model and encoders
try:
    with open('D:/Academics/SEM 5/SDE/Taskmanager/server/models/ml/reminder_model.pkl', 'rb') as f:
        model = pickle.load(f)

    with open('D:/Academics/SEM 5/SDE/Taskmanager/server/models/ml/vocal.pkl', 'rb') as f:
        vocal = pickle.load(f)
except Exception as e:
    print(f"Error loading model or encoder: {e}")
    sys.exit(1)

priority_encoder = LabelEncoder()
priority_encoder.fit(['low', 'medium', 'high'])

# Function to calculate days remaining until deadline
def days_until_deadline(deadline):
    try:
        return (datetime.strptime(deadline, "%Y-%m-%d") - datetime.now()).days
    except ValueError as e:
        print(f"Error in date format: {e}")
        sys.exit(1)

# Prediction function
def predict_reminder(description, priority, deadline):
    try:
        days_remaining = days_until_deadline(deadline)
        priority_encoded = priority_encoder.transform([priority])[0]
        task_data = pd.DataFrame([[description, priority_encoded, days_remaining]], 
                                 columns=['description', 'priority_encoded', 'days_remaining'])

        # Get the numerical prediction (0, 1, or 2)
        result = model.predict(task_data)[0]
        
        # Map the result to the corresponding label
        if result == 2:
            return "daily"
        elif result == 1:
            return "weekly"
        else:
            return "monthly"
    except Exception as e:
        print(f"Error in prediction: {e}")
        sys.exit(1)

# Check if arguments are passed from Node.js or use a sample
if __name__ == "__main__":
    try:
        description = sys.argv[1]
        priority = sys.argv[2]
        deadline = sys.argv[3]
    except IndexError:
        print("Error: Missing arguments. Please provide description, priority, and deadline.")
        sys.exit(1)

    # Using a sample for testing
    result = predict_reminder(description, priority, deadline)

    # Output the result
    print(result)  # This will print "daily", "weekly", or "monthly" based on prediction
