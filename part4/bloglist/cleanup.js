const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://prueba_db_user:TCXCIDzirWDgcGxq@cluster0.4ggyipq.mongodb.net/bloglistApp?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB')
    
    const db = mongoose.connection.db
    
    const blogsResult = await db.collection('blogs').deleteMany({})
    console.log(`Deleted ${blogsResult.deletedCount} blogs`)
    
    const usersResult = await db.collection('users').deleteMany({})
    console.log(`Deleted ${usersResult.deletedCount} users`)
    
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    process.exit(0)
  })
  .catch(err => {
    console.error('Error:', err.message)
    process.exit(1)
  })