package com.anitsuga.fwk.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileReader;

import static com.anitsuga.fwk.utils.StringUtils.*;

/**
 * AppProperties
 * @author agustina.dagnino
 *
 */
public class AppProperties {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AppProperties.class.getName());

    /**
     * config
     */
    private static java.util.Properties config = new java.util.Properties();
    
    /**
     * instance
     */
    private static AppProperties instance = null;
    
    
    /**
     * getInstance
     * @return
     */
    public static AppProperties getInstance(){
        if(instance==null){
            instance = new AppProperties();
        }
        return instance;
    }
    
    /**
     * Constructor
     */
    private AppProperties() {
        try {
            config.load(new FileReader("resources/app.properties"));
            //config.load(this.getClass().getClassLoader().getResourceAsStream("app.properties"));
        } catch (Exception e) {
            LOGGER.error("Could not read properties file.", e);
        }
    }
    
    /**
     * getProperty
     * @param property
     * @return
     */
    public String getProperty(String property){
        return config.getProperty(property);
    }

    /**
     * getPropertyAsDouble
     * @param property
     * @return double value
     */
    public double doubleValue(String property) {
        String value = getProperty(property);
        return toNumber(value).doubleValue();
    }

    /**
     * intValue
     * @param property
     * @return
     */
    public int intValue(String property) {
        String value = getProperty(property);
        return toNumber(value).intValue();
    }

    /**
     * booleanValue
     * @param property
     * @param defaultValue
     * @return
     */
    public boolean booleanValue(String property, boolean defaultValue ) {
        String value = getProperty(property);
        return isEmpty(value)? defaultValue : toBoolean(value).booleanValue();
    }

    /**
     * isPropertyEmpty
     * @param property
     * @return
     */
    public boolean isPropertyEmpty(String property) {
        boolean ret = false;
        String prop = getProperty(property);
        if( isEmpty(prop) ){
            LOGGER.error("{} is empty", prop);
            ret = true;
        }
        return ret;
    }
}
