package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.model.RankedPlayer;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * WTARankingPage
 * @author agustina.dagnino
 */
public class WTARankingPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(WTARankingPage.class.getName());

    @FindBy(xpath = "//*[@class=\"rankings__row\"]/td/a[@class=\"rankings__player-link rankings__player-link--chrome\"]")
    private List<WebElement> players;

    @FindBy(xpath = "//*[@class=\"btn rankings__show-more js-mobile-load-more\"]")
    private WebElement loadMoreBtn;

    /**
     * Default constructor
     *
     * @param driver
     */
    public WTARankingPage(WebDriver driver) {
        super(driver);
    }

    /**
     * go
     * @param url
     * @return
     */
    public WTARankingPage go(String url) {
        // go to url
        driver.get(url);

        // return page
        return new WTARankingPage(this.driver);
    }

    /**
     * forceLoadOnScroll
     */
    public void forceLoadOnScroll(){
        int numScrolls = 6;
        int sleepTime = 3000;

        try {
            for( int i=1; i<=numScrolls; i++){
                String command = String.format("window.scrollTo(0, %d*document.body.scrollHeight/%d);",i,numScrolls);
                ((JavascriptExecutor) this.driver).executeScript(command);

                if( loadMoreBtn.isDisplayed() ){
                    loadMoreBtn.click();
                }

                Thread.sleep(sleepTime);
            }
        } catch (Throwable e) {
            LOGGER.error("Error scrolling page down",e);
        }
    }

    /**
     * getRankedPlayers
     * @return
     */
    public List<RankedPlayer> getRankedPlayers( String league ){
        List<RankedPlayer> ret = new ArrayList<RankedPlayer>();
        int count = 0;
        int max = AppProperties.getInstance().intValue("max.ranking");
        for (WebElement player : players) {
            RankedPlayer ranking = new RankedPlayer();
            ranking.setLeague( league );
            ranking.setName( player.getText() );
            ranking.setSource( player.getAttribute("href") );
            ret.add(ranking);
            if( ++count>=max ) break;
        }
        return ret;
    }
}
