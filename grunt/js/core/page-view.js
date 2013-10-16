if (typeof analytics==='undefined') analytics={};
analytics.pageView = (function(config,omniture,mediaModule,testAndTarget,channelManager,newOrRepeatVisits,userHistory,utils){

    var pluginsLoaded = false,
        setVariable = omniture.setVariable,
        setEvent = omniture.setEvent;

    function setPageDescriptions(){
        var siteName = setVariable('siteName','sky/portal/' + config.site),
            pageName = setVariable('pageName', siteName + "/" + config.page);
        setVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        setVariable('pageURL','D=Referer');//todo: andrew, delete? i dont see s.referer beingset
        setVariable('contentType',config.contentType);//todo: andrew, delete? i dont see s.referer beingset
        setVariable('url',config.url);//todo: andrew, delete? i dont see s.referer beingset
        setVariable('contentId',config.contentId);//todo: andrew, delete? i dont see s.referer beingset
        setVariable('section','sky/portal/' + config.site);//todo: andrew, delete? i dont see s.referer beingset
        setVariable('section0', siteName + '/' +  config.section.split('/').slice(0,1).join('/'));
        setVariable('section1', siteName + '/' +  config.section.split('/').slice(0,2).join('/'));
        setVariable('section2', siteName + '/' +  config.section.split('/').slice(0,3).join('/'));
        setVariable('pageDescription', config.site + "/" + config.page);
        setVariable('headline', config.headline);

        if (config.headline) {
            setVariable('fullPageDescription', (config.site + '/' + config.section+ '/' + config.headline).substring(0,255));
        } else{
            setVariable('fullPageDescription', pageName.substring(0,255));
        }
    }

    function setSearchVars(){
        if (config.searchResults !== undefined ) {
            setVariable('searchResults', config.searchResults);
            setVariable('searchType', config.searchType); //todo: andrew, added these - neccersary or added as custom var on page js
            setVariable('searchTerms', config.searchTerms); //todo: andrew, added these - neccersary or added as custom var on page js
            setEvent('searchResults');
            if (config.searchResults === 0) {
                setEvent('zeroResults');
            }
        }
    }

    function setErrorEvents(){
        if (config.errors) {
            setVariable('errors', config.errors);
            setEvent('error');
        }
    }

    function track() {
            var name;

            setEvent('pageLoad');

            setPageDescriptions();
            setSearchVars();
            setErrorEvents();

            for (name in config.loadVariables){
                setVariable(name, config.loadVariables[name]);
            }
            for (name in config.loadEvents){
                setEvent(config.loadEvents[name]);
            }
            for (name in config) {
                setVariable(name, config[name]);
            }

            loadPlugins();

            if(config.track){ //todo: document this
                omniture.trackPage();
            }
            omniture.reset();
        }

    function loadPlugins() {//  todo: double check ordering. which ones are pge view plugins and which are setup?
            if(pluginsLoaded){ return; }

            utils.load(); //must go first - user history needs it to set a campaign evar
            channelManager.load(); //must go first - user history needs it to set a campaign evar
            userHistory.load();
            testAndTarget.load();
            mediaModule.load();
            newOrRepeatVisits.load();

            pluginsLoaded = true;
    }

    return {
        track: track
    };

}(analytics.config,
    analytics.omniture,
    analytics.plugins.mediaModule,
    analytics.plugins.testAndTarget,
    analytics.plugins.channelManager,
    analytics.plugins.newOrRepeatVisits,
    analytics.plugins.userHistory,
    analytics.plugins.utils
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/page-view", [
        'core/config',
        'core/omniture',
        'plugins/media-module',
        'plugins/test-and-target',
        'plugins/channel-manager',
        'plugins/new-or-repeat-visits',
        'plugins/user-history',
        'plugins/utils'
    ], function(config, omniture, mediaModule, testAndTarget, channelManager, newOrRepeatVisits, userHistory, utils) {
        return analytics.pageView;
    });
}