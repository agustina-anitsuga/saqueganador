package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * StatsExcelWriter
 * @author agustina.dagnino
 */
public class StatsExcelWriter extends ExcelWriter {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(StatsExcelWriter.class.getName());

    private final String[] fields = new String[] {
            "League",
            "Full Name",
            "Summary",
            "Clay",
            "Hard",
            "Indoors",
            "Grass",
            "NotSet",
            "Source"
    };

    /**
     * StatsExcelWriter
     * @param outputFileName
     */
    public StatsExcelWriter(String outputFileName ){
        super(outputFileName);
    }

    /**
     * writeFieldsToRow
     * @param player
     * @param row
     */
    protected void writeFieldsToRow(Content player, Row row) {
        int columnCount = 0;
        Player result = (Player) player;
        writeField(row,result.getLeague(),columnCount++);
        writeField(row,result.getFullName(),columnCount++);
        writeField(row,result.getStats().getSummary(),columnCount++);
        writeField(row,result.getStats().getClay(),columnCount++);
        writeField(row,result.getStats().getHard(),columnCount++);
        writeField(row,result.getStats().getIndoors(),columnCount++);
        writeField(row,result.getStats().getGrass(),columnCount++);
        writeField(row,result.getStats().getNotset(),columnCount++);
        writeField(row,result.getSource(),columnCount++);
    }

    /**
     * getFields
     * @return
     */
    protected String[] getFields() {
        return this.fields;
    }

    /**
     * getOutputFileName
     * @return
     */
    protected String getOutputFileName() {
        return String.format("%s/players-stats.xlsx",outputFileName);
    }
}
