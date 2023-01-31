package com.anitsuga.robot;

import com.anitsuga.fwk.utils.Browser;
import com.anitsuga.fwk.utils.SeleniumUtils;
import com.anitsuga.robot.model.Content;
import org.openqa.selenium.WebDriver;

import java.util.List;


/**
 * Robot
 * @author agustina.dagnino
 *
 */
public interface Robot {

    /**
     * scrape
     */
    public List<Content> scrape(WebDriver driver);
 
    /**
     * validConfig
     * @return
     */
    public boolean validConfig();

    /**
     * storeContent
     */
    public void storeContent(List<Content> content);

}
