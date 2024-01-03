package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * PlayerExcelWriter
 * @author agustina.dagnino
 */
public class PlayerExcelWriter extends ExcelWriter {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(PlayerExcelWriter.class.getName());

    private final String[] fields = new String[] {
            "League",
            "First Name",
            "Last Name",
            "Full Name",
            "Birth Date",
            "Birth Place",
            "Nationality",
            "Year Turned Pro",
            "Weight In Kilos",
            "Height In Cm",
            "Game Style",
            "Coach",
            "Profile Pic Url",
            "Biography",
            "Ranking",
            "Win Ratio",
            "League Profile Url",
            "Source"
    };

    /**
     * PlayerExcelWriter
     * @param outputFileName
     */
    public PlayerExcelWriter(String outputFileName ){
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
        writeField(row,result.getFirstName(),columnCount++);
        writeField(row,result.getLastName(),columnCount++);
        writeField(row,result.getFullName(),columnCount++);
        writeField(row,result.getBirthDate()==null?null:result.getBirthDate().toString(),columnCount++);
        writeField(row,result.getBirthPlace(),columnCount++);
        writeField(row,result.getNationality(),columnCount++);
        writeField(row,result.getYearTurnedPro()==null?null:result.getYearTurnedPro().toString(),columnCount++);
        writeField(row,result.getWeightInKilos()==null?null:result.getWeightInKilos().toString(),columnCount++);
        writeField(row,result.getHeightInCm()==null?null:result.getHeightInCm().toString(),columnCount++);
        writeField(row,result.getGameStyle(),columnCount++);
        writeField(row,result.getCoach(),columnCount++);
        writeField(row,result.getProfilePicUrl(),columnCount++);
        writeField(row,result.getBiography(),columnCount++);
        writeField(row,result.getRanking()==null?null:result.getRanking().toString(),columnCount++);
        writeField(row,result.getWinRatio(),columnCount++);
        writeField(row,result.getLeagueProfileUrl(),columnCount++);
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
        return String.format("%s/players.xlsx",super.outputFileName);
    }
}
