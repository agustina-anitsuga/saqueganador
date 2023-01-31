package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import com.anitsuga.robot.model.Ranking;

import java.util.List;

/**
 * PlayerJsonWriter
 * @author agustina.dagnino
 */
public class PlayerJsonWriter extends Writer {

    private String outputFileName;

    /**
     * PlayerJsonWriter
     * @param outputFileName
     */
    public PlayerJsonWriter(String outputFileName ){
        this.outputFileName = outputFileName;
    }

    /**
     * write
     * @param content
     */
    @Override
    public void write(List<Content> content) {
        for (Content player: content) {
            if( player!=null ) {
                String data = getJson(player);
                this.writeToFile(getOutputFileName((Player) player), data);
            }
        }
    }

    /**
     * getOutputFileName
     * @param player
     * @return
     */
    private String getOutputFileName(Player player) {
        return String.format("%s/%s.json",outputFileName,player.getKey());
    }
}
