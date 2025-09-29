const mongoose = require("mongoose");
require("dotenv").config();

// Azure Cosmos DB connection string (URL encoded password)
const COSMOS_CONNECTION_STRING =
  "mongodb+srv://AdhyayanMargAdmin:%3CTeDxE85wcWtfmq7Q0g%23C%3E@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

// Cosmos DB optimized connection options
const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxIdleTimeMS: 120000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false, // Cosmos DB doesn't support retryable writes
  maxPoolSize: 10, // Limit connection pool size for Cosmos DB
  minPoolSize: 1,
  socketTimeoutMS: 45000,
};

async function testCosmosConnection() {
  try {
    console.log("🚀 Testing Azure Cosmos DB connection...");
    console.log(
      "📡 Connection String:",
      COSMOS_CONNECTION_STRING.replace(/<TeDxE85wcWtfmq7Q0g#C>/, "***")
    );

    // Connect to Cosmos DB
    await mongoose.connect(COSMOS_CONNECTION_STRING, connectionOptions);

    console.log("✅ Successfully connected to Azure Cosmos DB!");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("🔌 Port:", mongoose.connection.port);
    console.log("📈 Ready State:", mongoose.connection.readyState);

    // Test basic operations
    console.log("\n🧪 Testing basic operations...");

    // Create a test collection and document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now },
      testData: String,
    });

    const TestModel = mongoose.model("ConnectionTest", TestSchema);

    // Insert test document
    const testDoc = new TestModel({
      name: "Smart Student Hub Test",
      testData: "Azure Cosmos DB connection test successful",
    });

    await testDoc.save();
    console.log("✅ Document insertion successful");

    // Query test document
    const foundDoc = await TestModel.findOne({
      name: "Smart Student Hub Test",
    });
    if (foundDoc) {
      console.log("✅ Document query successful");
      console.log("📄 Test document:", foundDoc);
    }

    // Clean up test document
    await TestModel.deleteOne({ name: "Smart Student Hub Test" });
    console.log("✅ Document cleanup successful");

    // Test aggregation (basic)
    const aggregationResult = await TestModel.aggregate([
      { $match: { name: { $exists: true } } },
      { $count: "total" },
    ]);
    console.log("✅ Aggregation test successful");

    // Test indexes
    console.log("\n🔍 Testing database indexes...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📚 Available collections:",
      collections.map((c) => c.name)
    );

    // Test connection health
    const healthStatus = {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: collections.length,
    };

    console.log("\n📊 Connection Health Status:");
    console.log(JSON.stringify(healthStatus, null, 2));

    console.log("\n🎉 Azure Cosmos DB connection test completed successfully!");
    console.log("✅ All operations working correctly");
    console.log("🚀 Ready to run Smart Student Hub with Azure Cosmos DB");
  } catch (error) {
    console.error("❌ Azure Cosmos DB connection test failed:");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Name:", error.name);

    if (error.code === "ENOTFOUND") {
      console.error("💡 Possible solutions:");
      console.error("1. Check your internet connection");
      console.error("2. Verify the connection string is correct");
      console.error("3. Ensure Azure Cosmos DB account is accessible");
    } else if (error.code === 18) {
      console.error("💡 Authentication failed - check credentials");
    } else if (error.code === 6) {
      console.error("💡 Network error - check firewall settings");
    }

    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("🔌 Connection closed");
  }
}

// Run the test
testCosmosConnection().catch(console.error);
