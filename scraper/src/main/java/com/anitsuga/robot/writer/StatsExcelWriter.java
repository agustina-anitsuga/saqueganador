package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;


/**
 * PlayerExcelWriter
 * @author agustina.dagnino
 */
public class StatsExcelWriter extends Writer {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(StatsExcelWriter.class.getName());

    private String outputFileName;

    private String[] fields = new String[] {
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
     * PlayerExcelWriter
     * @param outputFileName
     */
    public StatsExcelWriter(String outputFileName ){
        this.outputFileName = outputFileName;
    }

    /**
     * write
     * @param content
     */
    @Override
    public void write(List<Content> content) {

        FileOutputStream outputStream = null;
        Workbook workbook = null;

        try {
            workbook = this.createWorkbook(content);
            outputStream = new FileOutputStream(getOutputFileName());
            workbook.write(outputStream);
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }  finally {
            if(outputStream!=null){
                try {
                    outputStream.close();
                } catch (Exception e) {
                    LOGGER.error(e.getMessage());
                }
            }
        }

    }

    /**
     * createWorkbook
     * @param content
     * @return
     */
    private Workbook createWorkbook(List<Content> content) throws IOException {

        LOGGER.info("Writing "+content.size()+" results");
        int rowCount = 0;
        int columnCount=0;

        Workbook workbook = WorkbookFactory.create(true);
        Sheet sheet = workbook.createSheet("result");

        // write header
        String[] fields = this.getFields();
        Row headerRow = sheet.createRow(rowCount++);
        for (int i = 0; i < fields.length; i++) {
            CellStyle cellstyle = this.getHeaderFieldsStyle(workbook);
            Cell cell = headerRow.createCell(columnCount++);
            cell.setCellValue(fields[i]);
            cell.setCellStyle(cellstyle);
        }

        // write data
        for (Content player : content) {
            try
            {
                Row row = sheet.createRow(rowCount++);
                this.writeFieldsToRow(player, row);
            } catch (Exception e) {
                LOGGER.error(e.getMessage());
            }
        }

        LOGGER.info("Done writing "+content.size()+" results");
        return workbook;
    }

    /**
     * writeFieldsToRow
     * @param player
     * @param row
     */
    private void writeFieldsToRow(Content player, Row row) {
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
     * writeField
     * @param data
     */
    private void writeField(Row row, String data, int columnCount) {
        Cell cell = row.createCell(columnCount);
        cell.setCellValue(data);
    }

    /**
     * getHeaderFieldsStyle
     * @param workbook
     * @return
     */
    private CellStyle getHeaderFieldsStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    /**
     * getFields
     * @return
     */
    private String[] getFields() {
        return this.fields;
    }

    /**
     * getOutputFileName
     * @return
     */
    private String getOutputFileName() {
        return String.format("%s/players-stats.xlsx",outputFileName);
    }
}
