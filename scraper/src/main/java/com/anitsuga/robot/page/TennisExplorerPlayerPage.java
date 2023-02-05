package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * TennisExplorerPlayerPage
 * @author agustina.dagnino
 */
public class TennisExplorerPlayerPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(TennisExplorerPlayerPage.class.getName());


    @FindBy(xpath = "//*[@id=\"center\"]/div[1]/table/tbody/tr/td[2]/h3")
    private WebElement fullName;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[2]")
    private WebElement summary;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[3]")
    private WebElement clay;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[4]")
    private WebElement hard;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[5]")
    private WebElement indoors;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[6]")
    private WebElement grass;

    @FindBy(xpath = "//*[@id=\"balMenu-1-data\"]/table/tfoot/tr/td[7]")
    private WebElement notset;



    /**
     * Default constructor
     *
     * @param driver
     */
    public TennisExplorerPlayerPage(WebDriver driver) {
        super(driver);
    }

    /**
     * go
     * @param url
     * @return
     */
    public Page go(String url) {
        // go to url
        driver.get(url);

        // return page
        return new TennisExplorerPlayerPage(this.driver);
    }


    public String getFullName(){
        String ret = null;
        try {
            ret = this.fullName.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain full name");
        }
        return ret;
    }

    public String getSummary(){
        String ret = null;
        try {
            ret = this.summary.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain summary for {}", this.getFullName());
        }
        return ret;
    }

    public String getClay(){
        String ret = null;
        try {
            ret = this.clay.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain clay for {}", this.getFullName());
        }
        return ret;
    }

    public String getHard(){
        String ret = null;
        try {
            ret = this.hard.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain hard for {}", this.getFullName());
        }
        return ret;
    }

    public String getIndoors(){
        String ret = null;
        try {
            ret = this.indoors.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain indoors for {}", this.getFullName());
        }
        return ret;
    }

    public String getGrass(){
        String ret = null;
        try {
            ret = this.grass.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain grass for {}", this.getFullName());
        }
        return ret;
    }

    public String getNotSet(){
        String ret = null;
        try {
            ret = this.notset.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain notSet for {}", this.getFullName());
        }
        return ret;
    }

}
