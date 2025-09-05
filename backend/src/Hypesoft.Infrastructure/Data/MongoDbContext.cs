using Hypesoft.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        // Configure MongoDB conventions
        var conventionPack = new ConventionPack { new CamelCaseElementNameConvention() };
        ConventionRegistry.Register("camelCase", conventionPack, type => true);

        var connectionString = configuration.GetConnectionString("MongoDB") 
            ?? throw new ArgumentNullException(nameof(configuration), "MongoDB connection string is required");
        
        var client = new MongoClient(connectionString);
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "hypesoft";
        _database = client.GetDatabase(databaseName);

        EnsureIndexes();
    }

    public IMongoCollection<Category> Categories => _database.GetCollection<Category>("categories");
    public IMongoCollection<Product> Products => _database.GetCollection<Product>("products");

    private void EnsureIndexes()
    {
        var categoryIndex = Builders<Category>.IndexKeys.Ascending(c => c.Name);
        Categories.Indexes.CreateOne(new CreateIndexModel<Category>(categoryIndex, new CreateIndexOptions { Background = true }));

        var productNameIndex = Builders<Product>.IndexKeys.Ascending(p => p.Name);
        Products.Indexes.CreateOne(new CreateIndexModel<Product>(productNameIndex, new CreateIndexOptions { Background = true }));

        var productCategoryIndex = Builders<Product>.IndexKeys.Ascending(p => p.CategoryId);
        Products.Indexes.CreateOne(new CreateIndexModel<Product>(productCategoryIndex, new CreateIndexOptions { Background = true }));

        var productActiveIndex = Builders<Product>.IndexKeys.Ascending("isActive");
        Products.Indexes.CreateOne(new CreateIndexModel<Product>(productActiveIndex, new CreateIndexOptions { Background = true }));
    }
}
