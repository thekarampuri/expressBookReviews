curl -s -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"john","password":"pass123"}' -c cookie.txt

Customer successfully logged in