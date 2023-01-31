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
 * ATPRankingPage
 * @author agustina.dagnino
 */
public class ATPRankingPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ATPRankingPage.class.getName());


    @FindBy(xpath = "//*[@class=\"player-cell-wrapper\"]/a")
    private List<WebElement> players;

    /**
     * Default constructor
     *
     * @param driver
     */
    public ATPRankingPage(WebDriver driver) {
        super(driver);
    }

    /**
     * go
     * @param url
     * @return
     */
    public ATPRankingPage go(String url) {
        // go to url
        driver.get(url);

        // return page
        return new ATPRankingPage(this.driver);
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
