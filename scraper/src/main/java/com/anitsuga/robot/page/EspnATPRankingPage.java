package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.model.RankedPlayer;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * EspnATPRankingPage
 * @author agustina.dagnino
 */
public class EspnATPRankingPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(EspnATPRankingPage.class.getName());


    @FindBy(xpath = "//*[@class=\"Table__Scroller\"]/table/tbody/tr/td/div/a")
    private List<WebElement> players;

    /**
     * Default constructor
     *
     * @param driver
     */
    public EspnATPRankingPage(WebDriver driver) {
        super(driver);
    }

    /**
     * go
     * @param url
     * @return
     */
    public EspnATPRankingPage go(String url) {
        // go to url
        driver.get(url);

        // return page
        return new EspnATPRankingPage(this.driver);
    }

    /**
     * getRankedPlayers
     * @return
     */
    public List<RankedPlayer> getRankedPlayers(String league){
        List<RankedPlayer> ret = new ArrayList<RankedPlayer>();
        int count = 0;
        int max = AppProperties.getInstance().intValue("max.ranking");
        for (WebElement player : players) {
            RankedPlayer ranking = new RankedPlayer();
            ranking.setLeague(league);
            ranking.setName( player.getText() );
            ranking.setSource( player.getAttribute("href") );
            ret.add(ranking);
            if( ++count>=max ) break;
        }
        return ret;
    }
}
