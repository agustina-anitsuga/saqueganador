package com.anitsuga.robot.writer;

import com.anitsuga.robot.model.Content;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;


/**
 * ExcelWriter
 * @author agustina.dagnino
 */
public abstract class ExcelWriter implements Writer {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ExcelWriter.class.getName());

    protected String outputFileName;

    /**
     * PlayerExcelWriter
     * @param outputFileName
     */
    public ExcelWriter(String outputFileName ){
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
    protected Workbook createWorkbook(List<Content> content) throws IOException {

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
        for (Content aContent : content) {
            try
            {
                Row row = sheet.createRow(rowCount++);
                this.writeFieldsToRow(aContent, row);
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
    protected abstract void writeFieldsToRow(Content player, Row row) ;

    /**
     * writeField
     * @param data
     */
    protected void writeField(Row row, String data, int columnCount) {
        Cell cell = row.createCell(columnCount);
        cell.setCellValue(data);
    }

    /**
     * getHeaderFieldsStyle
     * @param workbook
     * @return
     */
    protected CellStyle getHeaderFieldsStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    /**
     * getFields
     * @return
     */
    protected abstract String[] getFields();

    /**
     * getOutputFileName
     * @return
     */
    protected abstract String getOutputFileName() ;
}
