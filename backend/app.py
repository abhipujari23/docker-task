from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Backend Working!'

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "up"}), 200


@app.route('/admission', methods=['POST'])
def admission():
    data = request.json
    name = data.get('name')
    grade = data.get('grade')
    
    # Simple processing logic: Log it and potentially write to a file
    print(f"Processing admission for {name} with grade {grade}")
    
    # Append to a file for persistence (optional but good for 'processing')
    with open('admissions.log', 'a') as f:
        f.write(f"Name: {name}, Grade: {grade}\n")
        
    return jsonify({
        "status": "success",
        "message": f"Successfully processed admission for {name}",
        "received": {"name": name, "grade": grade}
    }), 201

if __name__ == '__main__':
    app.run(port=8000, host='0.0.0.0',debug=True)
