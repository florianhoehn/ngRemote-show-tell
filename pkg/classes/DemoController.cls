/**
* @author Florian Hoehn
* @date 10/05/2016
* @description controller to show VF RemoteObject override & JS Remoting options
*/
global with sharing class DemoController {
    /**
    * @author Florian Hoehn
    * @date 10/05/2016
    * @description constructor
    */
    public DemoController() {}

    /**
    * @author Florian Hoehn
    * @date 10/05/2016
    * @return List<Account> allAccounts - list of all retrieved accounts
    * @description get 'all' accounts by using JS Remoting to overcome VF Remoteobject limitations
    */
    @RemoteAction
    global static List<Account> getAll() {
        List<Account> allAccounts = [SELECT Id,
                                            Name
                                       FROM Account
                                      LIMIT 50000];
        return allAccounts;
    }

    /**
    * @author Florian Hoehn
    * @date 10/05/2016
    * @param String type - holds the sObject type
    * @param List<String> fields - holds a list of all fields that shoudl be retrieved
    * @param Map<String, Object> criteria - holds the where clause parameter
    * @return Map<String, Object> result - map of results objects (JSON object)
    * @description overrides retrieve method on contacts to add a little bit extra
    */
    @RemoteAction
    public static Map<String, Object> retrieve(String type,
                                               List<String> fields,
                                               Map<String, Object> criteria) {
        Map<String, Object> officialResult = RemoteObjectController.retrieve(type,
                                                                             fields,
                                                                             criteria);

        Map<String, Object> result = new Map<String, Object> {'extra'=> 'keks'};
        result.putAll(officialResult);
        return result;

        /* EXAMPLE TO USE VIA NGREMOTE
        Map<String, Object> result = new Map<String, Object>();
        result.put('records', myResultObjectList);
        result.put('size', 1);
        result.put('success', true);
        result.put('type', 'Callout');
        */
    }
}