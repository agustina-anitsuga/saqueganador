package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.StringUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import static com.anitsuga.fwk.utils.MeasurementUtils.convertFeetAndInchestoCm;


/**
 * WTAPlayerPage
 * @author agustina.dagnino
 */
public class WTAPlayerPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(WTAPlayerPage.class.getName());


    @FindBy(xpath = "//*[@class=\"profile-header-info__firstname\"]")
    private WebElement firstName;

    @FindBy(xpath = "//*[@class=\"profile-header-info__surname \"]")
    private WebElement lastName;

    @FindBy(xpath = "//*[@class=\"profile-header-info__surname profile-header-info__surname--smaller\"]")
    private WebElement lastNameCompound;

    @FindBy(xpath = "/html/body/section[4]/div/div[2]/div/div[2]/div[2]/div[1]/div[3]")
    private WebElement birthDate;
    @FindBy(xpath = "/html/body/section[4]/div/div[2]/div/div[2]/div[2]/div[2]/div[2]")
    private WebElement birthPlace;

    @FindBy(xpath = "//div[@class=\"profile-header-info__nationalityCode\"]")
    private WebElement nationality;

    @FindBy(xpath = "/html/body/section[4]/div/div[2]/div/div[2]/div[1]/div[1]/div[3]")
    private WebElement heightInCm;

    @FindBy(xpath = "//*[@class=\"profile-header-info__detail-height\"]")
    private WebElement heightInInches;

    @FindBy(xpath = "/html/body/section[4]/div/div[2]/div/div[2]/div[1]/div[2]/div[2]")
    private WebElement gameStyle;

    @FindBy(xpath = "/html/body/section[4]/div/div[1]/div[1]/div[1]/div/picture/img" )
    private WebElement profilePic;

    @FindBy(xpath = "//*[@id=\"main-content\"]/div/div/div/nav/ul/li[2]" )
    private WebElement bioButton;

    @FindBy(xpath="//*[@class=\"profile-bio__content wrapper\"]")
    private WebElement bio;

    /**
     * Default constructor
     *
     * @param driver
     */
    public WTAPlayerPage(WebDriver driver) {
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
        return new WTAPlayerPage(this.driver);
    }

    public String getFirstName(){
        return this.firstName.getText();
    }

    public String getLastName(){
        String ret = null;
        try {
            ret = this.lastName.getText();
        } catch ( Exception e ) {
            ret = this.lastNameCompound.getText();
        }
        return ret;
    }

    public Date getBirthDate(){
        Date d = null;
        try {
            String text = this.birthDate.getText();
            DateFormat format = new SimpleDateFormat("MMMM d yyyy", Locale.ENGLISH);
            d = format.parse(text);
        } catch ( Exception e ) {
            LOGGER.error("Unable to obtain birth date for {} ", this.getFullName());
            d = null;
        }
        return d;
    }

    public String getBirthPlace(){
        String ret = null;
        try {
            ret = this.birthPlace.getText();
        } catch (Exception e) {
            LOGGER.error("Unable to obtain birth place for {}", this.getFullName());
        }
        return ret;
    }

    public String getNationality() {
        String ret = null;
        try {
            ret = this.nationality.getText();
        } catch (Exception e) {
            LOGGER.error("Unable to obtain nationality place for {}", this.getFullName());
        }
        return ret;
    }

    public Integer getHeightInCm(){
        Integer ret = null;
        try {
            String text = this.heightInCm.getText();
            text = text.replaceAll("m", "");
            Number num = StringUtils.toNumber(text);
            ret = Integer.valueOf((int) (num.doubleValue() * 100));
        } catch ( Exception e ){
            try {
                String text = this.heightInInches.getText();
                String[] components = text.split(" ");
                Number feet = StringUtils.toNumber(components[0].replaceAll("'", ""));
                Number inches = StringUtils.toNumber(components[1].replaceAll("\"", ""));
                ret = convertFeetAndInchestoCm(feet, inches);
            } catch (Exception e1) {
                LOGGER.error("Unable to obtain height for {}", this.getFullName());
            }
        }
        return ret;
    }

    public String getGameStyle(){
        String ret = null;
        try {
            ret = this.gameStyle.getText();
        } catch (Exception e) {
            LOGGER.error("Unable to obtain game style for {}", this.getFullName());
        }
        return ret;
    }

    public String getProfilePicUrl() {
        String ret = null;
        try {
            ret = this.profilePic.getAttribute("src");
        } catch (Exception e) {
            LOGGER.error("Unable to obtain profile picture url for {}", this.getFullName());
        }
        return ret;
    }

    public String getBiography(){
        String ret = null;
        try {
            this.bioButton.click();
            while( !this.bio.isDisplayed() ){
                sleepSafe(10);
            }
            ret = bio.getText();
        } catch (Exception e) {
            LOGGER.error("Unable to obtain biography for {}", this.getFullName());
        }
        return ret;
    }

    private void sleepSafe(int sleepTimeMillis) {
        try {
            Thread.sleep(sleepTimeMillis);
        } catch (InterruptedException e) {
        }
    }

    public void waitUntilLoaded() {
        while( !this.firstName.isDisplayed() ){ this.sleepSafe(500 ); }
    }

    public String getFullName() {
        return String.format("%s %s",this.getFirstName(),this.getLastName());
    }
}
