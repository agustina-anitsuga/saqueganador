package com.anitsuga.fwk.utils;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.anitsuga.fwk.exception.FrontEndException;


/**
 * SeleniumUtils
 * 
 * @author agustina.dagnino
 *
 */
public class SeleniumUtils {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(SeleniumUtils.class.getName());
    
    
    /**
     * Private Constructor
     */
    private SeleniumUtils() {
        // class should not be instantiated
    }

    /**
     * buildDriver
     * 
     * @param browser
     * @return driver
     * @throws Exception
     */
    public static WebDriver buildDriver(Browser browser) throws FrontEndException {
        WebDriver driver = null;

        switch (browser) {
        case FIREFOX:
            driver = new FirefoxDriver();
            break;
        case CHROME:
            driver = new ChromeDriver();
            break;
        case IEXPLORE:
            driver = new InternetExplorerDriver();
            break;
        case HTML_UNIT:
            driver = new HtmlUnitDriver();
            break;

        default:
            throw new FrontEndException("Browser not found!");
        }
        
        driver.manage().window().maximize();
        return driver;
    }
    
    /**
     * getWait
     * @param driver
     * @return
     */
    public static WebDriverWait getWait(WebDriver driver) {
        return new WebDriverWait(driver, 3);
    }

    /**
     * getWait
     * @param driver
     * @return
     */
    public static WebDriverWait getWait(WebDriver driver, int maxWait ) {
        return new WebDriverWait(driver, maxWait);
    }
    
    /**
     * captureScreenshot
     * @param driver
     */
    public static void captureScreenshot(WebDriver driver) {
        if( isScreenshotEnabled() )
        try {
            // take screenshot and save it to file
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            String filename = getScreenshotFilename(System.currentTimeMillis());
            File file = new File(filename);
            FileUtils.copyFile(screenshot, file);
            LOGGER.info("Screenshot generated in: {}", file.getAbsolutePath());
        } catch (Exception ioe) {
            LOGGER.info("Could not generate screenshot. ",ioe);
        }
    }

    /**
     * getScreenshotFilename
     * @param time
     * @return
     */
    protected static String getScreenshotFilename(long time) {
        return String.format("output/robot-%d.jpg", time);
    }

    /**
     * isScreenshotEnabled
     * @return
     */
    protected static boolean isScreenshotEnabled() {
        return AppProperties.getInstance().booleanValue("screenshot.enabled", false);
    }
}
