package com.anitsuga.robot;

import java.util.ArrayList;
import java.util.List;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.*;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.writer.Writer;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AbstractRobot
 * @author agustina.dagnino
 *
 */
public abstract class AbstractRobot implements Robot {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractRobot.class.getName());

    protected RobotType robotType;

    protected Object parameters;

    /**
     * AbstractRobot
     * @param robotType
     * @param parameters
     */
    public AbstractRobot( RobotType robotType, Object... parameters ){
        this.robotType = robotType;
        this.parameters = (parameters!=null)? parameters[0] : null ;
    }

    /**
     * scrape
     */
    @Override
    public List<Content> scrape( WebDriver driver ) {
        
        RobotURLProvider urlProvider = robotType.getURLProviders();
        urlProvider.setParameters(this.parameters);

        List<Content> ret = new ArrayList<Content>();
        List<String> contentUrls = urlProvider.getURLs();
        
        int total = contentUrls.size();
        int count = 0;
        for (String contentUrl : contentUrls) {
            LOGGER.info("Reading {} [{}/{}] from url {}",
                    robotType.getContentTypeName(),
                    ++count,
                    total,
                    contentUrl
                    );
            Content object = this.getContent(contentUrl, driver);
            ret.add(object);
        }
        
        return ret;
    }
    
    /**
     * getContent
     * @param url
     * @param driver
     * @return
     */
    protected Content getContent( String url, WebDriver driver ){
        Content ret = null;
        try {
            // open browser to requested url
            Page contentPage = goToContentPage(url, driver);
            if( contentPage != null )
            {
                ret = this.scrapeContent(url, driver, contentPage);
            }
        } catch (Exception e) {
            
            // take screenshot of error
            SeleniumUtils.captureScreenshot(driver);

            // log exception
            LOGGER.error("Error reading URL {}", url, e);
        }
        return ret;
    }

    /**
     * storeContent
     * @param content
     */
    public void storeContent( List<Content> content ){
        for (Writer writer:robotType.getWriters()) {
            writer.write(content);
        }
    }

    /**
     * goToContentPage
     * @param url
     * @param driver
     * @return
     */
    protected abstract Page goToContentPage(String url, WebDriver driver);

    /**
     * scrapeContent
     *
     * @param url
     * @param driver
     * @param contentPage
     * @return
     */
    protected abstract Content scrapeContent(String url, WebDriver driver, Page contentPage);



    /**
     * validConfig
     */
    @Override
    public boolean validConfig() {
        return true;
    }


    /**
     * runRobot
     */
    public static List<Content> runRobot(WebDriver driver, RobotType type, Object... parameters ) {
        LOGGER.info("Starting robot {}", type);

        // get robot
        Robot robot = type.getInstance( parameters );

        // validate config
        if( !robot.validConfig() ) {
            LOGGER.error("Config is invalid. Please initialize app.properties");
            return null;
        }

        // scrape content
        List<Content> content = robot.scrape(driver);

        // store content
        robot.storeContent(content);

        LOGGER.info("Finished robot {}",type);
        return content;
    }

}
