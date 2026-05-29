import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Personal Data for Patil Ganesh
PROFILE_DATA = {
    "name": "Patil Ganesh",
    "roles": ["Web Developer", "Full Stack Developer", "Cybersecurity Researcher"],
    "bio": "Building seamless digital experiences and securing them from the ground up — I’m a developer who designs elegant, high-performance, and secure web applications.",
    "email": "gp148454@gmail.com",
    "phone": "+91 91778 65726",
    "socials": {
        "github": "https://github.com/ganeshpatil64",
        "linkedin": "https://www.linkedin.com/in/patil-ganesh",
        "twitter": "https://x.com/ganeshpatil64"
    },
    "education": {
        "degree": "B.Tech in Computer Science and Engineering",
        "institution": "Parul University",
        "years": "2024 - 2028"
    },
    "skills": {
        "languages": [
            {"name": "Python", "level": 90},
            {"name": "JavaScript", "level": 85},
            {"name": "TypeScript", "level": 80},
            {"name": "Java", "level": 75},
            {"name": "HTML5 / CSS3", "level": 95}
        ],
        "frameworks": [
            {"name": "React", "level": 85},
            {"name": "Node.js", "level": 80},
            {"name": "Flask", "level": 85},
            {"name": "PostgreSQL", "level": 80},
            {"name": "TailwindCSS", "level": 90}
        ],
        "cybersecurity": [
            {"name": "Network Scanning (Nmap)", "level": 85},
            {"name": "Vulnerability Analysis", "level": 80},
            {"name": "OWASP Top 10", "level": 80},
            {"name": "Packet Analysis (Scapy)", "level": 75},
            {"name": "Git / Docker", "level": 85}
        ]
    },
    "projects": [
        {
            "id": "secureauth",
            "title": "SecureAuth API Gateway",
            "tech": "Node.js, Express, Redis, JWT, Helmet.js",
            "year": "2025",
            "description": "High-performance API Gateway with secure token-based authentication and custom routing.",
            "bullets": [
                "Implemented sliding-window rate limiting with Redis to mitigate brute-force and DDoS attacks.",
                "Configured dynamic security headers using Helmet.js and custom OWASP policy guards."
            ],
            "github": "https://github.com/gp148454/SecureAuth-Gateway"
        },
        {
            "id": "vulnscan",
            "title": "VulnScan Network Tool",
            "tech": "Python, Nmap API, Scapy, SQLite",
            "year": "2024",
            "description": "Lightweight network security port scanner and vulnerability checking dashboard.",
            "bullets": [
                "Automated vulnerability detection by matching active service versions against global CVE feeds.",
                "Developed an engaging terminal dashboard for visual network scanning progress graphs."
            ],
            "github": "https://github.com/gp148454/VulnScan"
        },
        {
            "id": "omnishop",
            "title": "OmniShop E-Commerce Platform",
            "tech": "React, TypeScript, TailwindCSS, Node.js, PostgreSQL, Stripe",
            "year": "2025",
            "description": "Full-featured online shop integrated with secure payment systems and analytical control panels.",
            "bullets": [
                "Built custom admin analytics boards to track daily volume, product stocks, and traffic origins.",
                "Optimized SQL queries and database index layouts for rapid data loading times under 100ms."
            ],
            "github": "https://github.com/gp148454/OmniShop"
        }
    ]
}

@app.route("/")
def home():
    return render_template("index.html", profile=PROFILE_DATA)

@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.json or request.form
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")
        
        if not name or not email or not message:
            return jsonify({"status": "error", "message": "All fields are required!"}), 400
            
        # Structure contact message
        msg_entry = {
            "name": name,
            "email": email,
            "message": message,
            "timestamp": request.headers.get("X-Forwarded-For", request.remote_addr)
        }
        
        # Save locally to a JSON file
        messages_file = os.path.join(os.path.dirname(__file__), "messages.json")
        messages = []
        if os.path.exists(messages_file):
            with open(messages_file, "r") as f:
                try:
                    messages = json.load(f)
                except Exception:
                    pass
        
        messages.append(msg_entry)
        with open(messages_file, "w") as f:
            json.dump(messages, f, indent=4)
            
        print(f"\n[CONTACT FORM] New message from {name} ({email}):\n\"{message}\"\n")
        return jsonify({"status": "success", "message": "Message saved successfully! Thank you."}), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
