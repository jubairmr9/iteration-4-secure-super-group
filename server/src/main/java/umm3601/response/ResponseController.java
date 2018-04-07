package umm3601.response;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Map;

public class ResponseController extends SuperController{


    public ResponseController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("responses");
    }

    public String addNewResource(String responseName, String responseEmail, String responseLink) {

        // makes the search Document key-pairs
        Document newResponse = new Document();
        // Append new resources here
        newResponse.append("name", responseName);
        newResponse.append("email", responseEmail);
        newResponse.append("link", responseLink);

        try {
            collection.insertOne(newResponse);
            ObjectId id = newResponse.getObjectId("_id");

            System.err.println("Successfully added new resource [_id=" + id + ", responseName=" + responseName + "," +
                " responseEmail=" + responseEmail + ", link=" + responseLink + ']');
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    @Override
    public String getItems(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("email")) {
            String targetEmail = (queryParams.get("email")[0]);
            filterDoc = filterDoc.append("email", "default");
            filterDoc = filterDoc.append("email", targetEmail);
        }

        FindIterable<Document> matchingItems = collection.find(filterDoc);

        return JSON.serialize(matchingItems);
    }
}