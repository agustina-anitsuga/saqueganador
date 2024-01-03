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
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import static com.anitsuga.fwk.utils.MeasurementUtils.convertFeetAndInchestoCm;
import static com.anitsuga.fwk.utils.MeasurementUtils.convertPoundsToKilos;

/**
 * EspnATPPlayerPage
 * @author agustina.dagnino
 */
public class EspnATPPlayerPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(EspnATPPlayerPage.class.getName());

    private static final Locale LOCALE_ES = new Locale("es", "AR");

    @FindBy(xpath = "//h1")
    private WebElement fullName;
    @FindBy(xpath = "//*[@class=\"general-info\"]/li[1]")
    private WebElement nationality;
    @FindBy(xpath = "//*[@class=\"general-info\"]/li[2]")
    private WebElement gameStyle;
    @FindBy(xpath = "//*[@class=\"general-info\"]/li[3]")
    private WebElement yearTurnedPro;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"]/li[1]")
    private WebElement birthDate;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"]/li[4]")
    private WebElement heightInInches;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"][2]/li[2]")
    private WebElement heightInInchesV2;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"][3]/li[1]")
    private WebElement heightInInchesV3;

    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"]/li[3]")
    private WebElement heightInInchesV4;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"]/li[5]")
    private WebElement weightInPounds;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft last\"]/li[1]")
    private WebElement weightInPoundsV2;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft last\"][3]/li[2]")
    private WebElement weightInPoundsV3;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"][3]/li[2]")
    private WebElement weightInPoundsV4;
    @FindBy(xpath = "//*[@class=\"player-metadata floatleft\"]/li[4]")
    private WebElement weightInPoundsV5;
    @FindBy(xpath = "//*[@class=\"main-headshot\"]/img")
    private WebElement profilePicUrl;
    @FindBy(xpath = "//*[@class=\"career\"]/td[3]")
    private WebElement winRatio;


    /**
     * Default constructor
     *
     * @param driver
     */
    public EspnATPPlayerPage(WebDriver driver) {
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
        return new EspnATPPlayerPage(this.driver);
    }

    public String getFullName(){
        return this.fullName.getText();
    }

    public String getNationality(){
        String ret = null;
        try {
            ret = this.nationality.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain nationality for {}", this.getFullName());
        }
        return ret;
    }

    public String getWinRatio(){
        String ret = null;
        try {
            ret = this.winRatio.getText();
        } catch(Exception e ){
            LOGGER.error("Cannot obtain winRatio for {}", this.getFullName());
        }
        return ret;
    }

    public String getGameStyle(){
        String ret = null;
        try {
            String text = this.gameStyle.getText();
            text = text.replace("Jugadas:", "");
            ret = text.trim();
        } catch (Exception e) {
            LOGGER.error("Cannot obtain game style for {}", this.getFullName());
        }
        return ret;
    }

    public Integer getYearTurnedPro() {
        Integer ret = null;
        try {
            String text = this.yearTurnedPro.getText();
            text = text.replace("Profesional desde:", "");
            Number num = StringUtils.toNumber(text.trim());
            ret = Integer.valueOf(num.intValue());
        } catch ( Exception e ){
            LOGGER.error("Unable to get year turned pro for {}",this.getFullName());
        }
        return ret;
    }

    public Date getBirthDate(){
        Date d = null;
        try {
            String text = this.birthDate.getText();
            text = text.replace("Fecha de nacimiento\n", "");
            text = text.substring(0, text.indexOf("(") );
            text = text.replaceAll("de ", "");
            DateFormat format = new SimpleDateFormat("d MMMM yyyy", LOCALE_ES);
            d = format.parse(text);
        } catch (ParseException e) {
            LOGGER.error("Unable to obtain birth date for {} ", this.getFullName());
            d = null;
        }
        return d;
    }

    public Integer getHeightInCm() {
        Integer ret = null;
        List<WebElement> elements = Arrays.asList(this.heightInInches,this.heightInInchesV2,this.heightInInchesV3,this.heightInInchesV4);
        for (WebElement element: elements) {
            ret = this.parseHeightInCm(element);
            if (ret != null) break;
        }
        if( ret == null ){
            LOGGER.error("Unable to obtain height for {}",this.getFullName());
        }
        return ret;
    }

    private Integer parseHeightInCm(WebElement element ) {
        Integer ret = null;
        try {
            String text = element.getText();
            text = text.replace("Altura","");
            text = text.replace("\n", "").trim();
            String[] components = text.split("-");
            Number feet = StringUtils.toNumber(components[0]);
            Number inches = StringUtils.toNumber(components[1]);
            ret = convertFeetAndInchestoCm(feet,inches);
        } catch (Exception e2) {
            ret = null;
        }
        return ret;
    }

    public Integer getWeightInKilos() {
        Integer ret = null;
        List<WebElement> elements = Arrays.asList(
                    this.weightInPounds,
                    this.weightInPoundsV2,
                    this.weightInPoundsV3,
                    this.weightInPoundsV4,
                    this.weightInPoundsV5);
        for (WebElement element: elements) {
            ret = this.parseWeightInCm(element);
            if (ret != null) break;
        }
        if( ret == null ){
            LOGGER.error("Unable to obtain weight for {}",this.getFullName());
        }
        return ret;
    }

    private Integer parseWeightInCm(WebElement element) {
        Integer ret = null;
        try {
            String text = element.getText();
            text = text.replace("Peso","");
            text = text.replace("\n","");
            text = text.replace("lbs.","");
            ret = convertPoundsToKilos(StringUtils.toNumber(text));
        } catch (Exception e2) {
            ret = null;
        }
        return ret;
    }

    public String getProfilePicUrl() {
        String ret = null;
        try {
            ret = this.profilePicUrl.getAttribute("src");
        } catch (Exception e) {
            LOGGER.error("Unable to obtain profile picture for {}", this.getFullName());
        }
        return ret;
    }

    public String getFirstName() {
        String ret = null;
        String[] parts = this.getFullName().split(" ");
        if( parts.length ==2 ){
            ret = parts[0];
        }
        return ret;
    }

    public String getLastName() {
        String ret = null;
        String[] parts = this.getFullName().split(" ");
        if( parts.length ==2 ){
            ret = parts[1];
        }
        return ret;
    }
}
