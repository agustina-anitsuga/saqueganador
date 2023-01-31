package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Ranking;


import java.util.List;

/**
 * RankingJsonWriter
 */
public class RankingJsonWriter extends Writer {

    private String outputFileName;

    /**
     * PlayerJsonWriter
     * @param outputFileName
     */
    public RankingJsonWriter(String outputFileName ){
        this.outputFileName = outputFileName;
    }

    /**
     * write
     * @param content
     */
    @Override
    public void write(List<Content> content) {
        Ranking rank = (Ranking) content.get(0);
        String data = getJson(rank);
        this.writeToFile( outputFileName, data );
    }
}
