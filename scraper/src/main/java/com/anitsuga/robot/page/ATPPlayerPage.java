package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * ATPPlayerPage
 * @author agustina.dagnino
 */
public class ATPPlayerPage extends Page {

    @FindBy(xpath = "//*[@class=\"first-name\"]")
    private WebElement firstName;
    @FindBy(xpath = "//*[@class=\"last-name\"]")
    private WebElement lastName;
    @FindBy(xpath = "//*[@id=\"playerProfileHero\"]/div[2]/div[2]/div/table/tr[2]/td[1]/div/div[2]")
    private WebElement birthPlace;
    @FindBy(xpath = "//*[@id=\"playerProfileHero\"]/div[2]/div[2]/div/table/tr[2]/td[2]/div/div[2]")
    private WebElement gameStyle;
    @FindBy(xpath = "//*[@id=\"playerProfileHero\"]/div[2]/div[2]/div/table/tr[2]/td[3]/div/div[2]")
    private WebElement coach;


    /**
     * Default constructor
     *
     * @param driver
     */
    public ATPPlayerPage(WebDriver driver) {
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
        return new ATPPlayerPage(this.driver);
    }

    public String getFirstName(){
        return this.firstName.getText();
    }

    public String getLastName(){
        return this.lastName.getText();
    }

    public String getBirthPlace(){
        return this.birthPlace.getText();
    }

    public String getGameStyle(){
        return this.gameStyle.getText();
    }

    public String getCoach(){
        return this.coach.getText();
    }
}
