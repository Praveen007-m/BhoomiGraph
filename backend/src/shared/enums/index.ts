export enum UserRole {
    FARMER = 'farmer',
    PILOT = 'pilot',
    AGRONOMIST = 'agronomist',
    ADMIN = 'admin'
}

export enum FarmStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum AdvisoryCategory {
    PEST = 'pest',
    IRRIGATION = 'irrigation',
    NUTRITION = 'nutrition',
    DISEASE = 'disease',
    GENERAL = 'general'
}

export enum AdvisorySeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum AdvisoryStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    RESOLVED = 'resolved'
}

export enum NotificationType {
    AGRONOMY = 'agronomy',
    BOOKING = 'booking',
    SYSTEM = 'system',
    WALLET = 'wallet'
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed'
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum SensorType {
    SOIL_MOISTURE = 'SoilSensor',
    WEATHER_STATION = 'WeatherStation',
    PH_SENSOR = 'PHSensor'
}
