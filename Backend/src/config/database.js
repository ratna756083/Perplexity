import mongoose from 'mongoose'

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI

    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not set')
    }

    await mongoose.connect(mongoUri)
    console.log('database connected')
}

export default connectDB