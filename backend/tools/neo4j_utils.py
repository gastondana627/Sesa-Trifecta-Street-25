from neo4j import GraphDatabase
import os

# --- CONFIGURATION ---
# In a real mission, these would be loaded securely from Google Secret Manager
# For local dev, you can use a .env file or set them here temporarily.
NEO4J_URI = os.environ.get("NEO4J_URI", "neo4j+s://your-instance.databases.neo4j.io")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "your-super-secret-password")

class Neo4jIAM:
    """A tool to interact with the Neo4j IAM graph database."""
    def __init__(self):
        try:
            self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            print("✅ Neo4j IAM system connected successfully.")
        except Exception as e:
            self.driver = None
            print(f"❌ CRITICAL ERROR: Could not connect to Neo4j IAM system: {e}")

    def close(self):
        if self.driver:
            self.driver.close()

    def check_permission(self, user_email: str, permission_name: str) -> bool:
        """
        Checks if a user has a specific permission, either directly,
        through their role, or through any group they are a member of.
        Returns True if a path to the permission exists, False otherwise.
        """
        if not self.driver:
            print("Neo4j driver not available. Permission check failed.")
            return False
            
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {email: $email})
                // Match any path from the user to the required permission
                // This query traverses through Groups and Roles automatically
                MATCH path = (u)-[:IS_MEMBER_OF|HAS_ROLE*0..5]->()-[:HAS_PERMISSION]->(p:Permission {name: $permission})
                // If any such path exists, the count will be greater than 0
                RETURN count(path) > 0 AS hasPermission
            """, email=user_email, permission=permission_name)
            
            record = result.single()
            return record["hasPermission"] if record else False