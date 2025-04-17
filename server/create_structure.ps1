# PowerShell script to create the required directories and files

$dirs = @(
    "server/config",
    "server/controllers",
    "server/middleware",
    "server/models",
    "server/routes",
    "server/sockets",
    "ai",
    "database"
)

$files = @(
    "server/config/db.js",
    "server/controllers/authController.js",
    "server/controllers/patientController.js",
    "server/controllers/doctorController.js",
    "server/controllers/appointmentController.js",
    "server/controllers/billingController.js",
    "server/controllers/pharmacyController.js",
    "server/controllers/labReportController.js",
    "server/controllers/chatController.js",
    "server/controllers/aiController.js",
    "server/middleware/authMiddleware.js",
    "server/middleware/roleMiddleware.js",
    "server/middleware/errorHandler.js",
    "server/models/User.js",
    "server/models/Patient.js",
    "server/models/Doctor.js",
    "server/models/Appointment.js",
    "server/models/Bill.js",
    "server/models/Pharmacy.js",
    "server/models/LabReport.js",
    "server/models/Chat.js",
    "server/routes/authRoutes.js",
    "server/routes/patientRoutes.js",
    "server/routes/doctorRoutes.js",
    "server/routes/appointmentRoutes.js",
    "server/routes/billingRoutes.js",
    "server/routes/pharmacyRoutes.js",
    "server/routes/labRoutes.js",
    "server/routes/chatRoutes.js",
    "server/sockets/chatSocket.js",
    "server/server.js",
    "server/.env",
    "ai/predictiveModel.py",
    "ai/symptomChecker.py",
    "database/seed.js",
    "docker-compose.yml",
    "nginx.conf",
    "README.md"
)

# Create directories if they don't exist
foreach ($dir in $dirs) {
    if (-Not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Create files if they don't exist
foreach ($file in $files) {
    if (-Not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created file: $file"
    }
}

Write-Host "✅ All necessary folders and files have been created!"
