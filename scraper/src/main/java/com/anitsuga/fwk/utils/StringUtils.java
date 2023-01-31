package com.anitsuga.fwk.utils;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * StringUtils
 * @author agustina.dagnino
 *
 */
public class StringUtils {

    
    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(StringUtils.class.getName());
    
    /**
     * Hide default constructor
     */
    private StringUtils() {
       // this class should not be instantiated
    }

    /**
     * parse
     * @param numberStr
     * @return number
     * @throws ParseException
     */
    public static Number toNumber(String numberStr ) {
        try {
            DecimalFormat df = new DecimalFormat();
            DecimalFormatSymbols symbols = new DecimalFormatSymbols();
            symbols.setDecimalSeparator('.');
            symbols.setGroupingSeparator(',');
            df.setDecimalFormatSymbols(symbols);
            return df.parse(numberStr);
        } catch (ParseException pe) {
            LOGGER.error("Could not parse string {}",numberStr,pe);
            return null;
        }
    }

    public static Boolean toBoolean( String numberStr ) {
        try {
            return Boolean.parseBoolean(numberStr);
        } catch (Exception pe) {
            LOGGER.error("Could not parse string {}",numberStr,pe);
            return null;
        }
    }
    

    /**
     * isEmpty
     * @param str
     * @return
     */
    public static boolean isEmpty(String str) {
        return str==null || "".equals(str.trim());
    }    
    
}
