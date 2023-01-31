package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Writer
 * @author agustina.dagnino
 */
public abstract class Writer {

    /**
     * write
     * @param content
     */
    public abstract void write(List<Content> content) ;

    /**
     * getJson
     * @param object
     * @return
     */
    public String getJson( Object object ){
        String jsonString = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            jsonString = mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return jsonString;
    }

    /**
     * writeToFile
     * @param outputFileName
     * @param data
     */
    public void writeToFile( String outputFileName, String data ){
        try {
            Path path = Paths.get(outputFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, data.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
