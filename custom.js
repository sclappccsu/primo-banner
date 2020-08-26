(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/
  /* Increase the number of Results fetched per request from 10 to 20. Modified per MH, to fix auto-scroll paging issue 021919 - SBC. */ 
  app.config(function() {
    var funky_threshold_key = 'FE UI '.concat('\u2013',' Scrolling Threshold'); /* Cannot embed high-ASCII in source-code, so use Javascript Unicode notation instead. */
    appConfig['system-configuration'][funky_threshold_key] = 20;  /* Change the navigation page-size. */
  });
  
  app.component('prmExploreMainAfter', {
    template: '<div id="customCSCU-ExploreMainAfter"></div><prm-explore-main-after-after parent-ctrl="$ctrl.parentCtrl"></prm-explore-main-after-after>',
    bindings: {parentCtrl: '<'},
    controller: 'customCSCU_prmExploreMainAfter'
  });
    
  app.controller('customCSCU_prmExploreMainAfter', [function() {
    var vm = this;
    vm.parentCtrl.searchService.searchStateService.resultsBulkSize = 20;
  }]);
  /* End of Increase the number of Results fetched. */
 
 /* Alter the Primo Browse page, Matthew Hull, December 2018 */ 
  app.controller('customCSCU_prmCustomBrowseLinkCtrl', ['$scope', function($scope) {
      var vm = this;
      var browseTargetText = vm.text;
      var currentParams = vm.parentCtrl.$state.params;
      var currentPage = vm.parentCtrl.$state.current.name || 'exploreMain.browseSearch';
      // console.dir(vm.parentCtrl);
      
      vm.havePrefCpy = vm.parentCtrl.havePref;
      vm.browseMoreURL = '';
      vm.hovertext = 'Browse on "' + browseTargetText + '"';
      // vm.linktext = 'More items with this ' + currentParams.browseScope;
      vm.linktext = browseTargetText;
      
      // vm.browseMoreURL = "/primo-explore/browse?vid=TCC_V1&browseScope=subject&fn=BrowseSearch&browseQuery=" + encodeURIComponent(browseTargetText);
      var browseObj = {};
      browseObj.vid = currentParams.vid;
      browseObj.browseScope = currentParams.browseScope;
      browseObj.innerPnxIndex = -1;
      browseObj.browseFirstTerm = '';
      browseObj.fn = 'BrowseSearch';
      browseObj.browseQuery = browseTargetText;
      vm.browseMoreURL = currentPage + '(' + JSON.stringify(browseObj) + ')';

  }]);
    
  app.component('prmCustomBrowseLink', {
      bindings: {
        parentCtrl: '<',
        text: '<'
      },
      controller: 'customCSCU_prmCustomBrowseLinkCtrl',
      template: '<div class="customCSCU browse-more-link" ng-if="$ctrl.havePrefCpy">' +
                '  <a ui-sref="{{$ctrl.browseMoreURL}}" title="{{$ctrl.hovertext}}" class="customCSCU arrow-link">{{$ctrl.linktext}}' +
                '  <prm-icon icon-type=svg svg-icon-set=primo-ui icon-definition=chevron-right link-arrow></prm-icon>' +
                '  </a>' +
                '</div>' + 
                '<prm-custom-browse-link-after parent-ctrl="$ctrl"></prm-custom-browse-link-after>'
  });

  /* Alter the template cache to augment the <prm-browse-result> component. (We add our <prm-custom-browse-link> therein.) */
  app.run(['$templateCache', function ($templateCache) {
      var templatesCopy = Object.assign({}, $templateCache);
      // console.dir(templatesCopy);
      var browseResultComponent = 'components/search/browse/browseResult/browse-result.html';
      var browseResultTemplate = $templateCache.get(browseResultComponent);
      // console.dir(browseResultTemplate);
      if (browseResultTemplate) {
        /* Replace the existing non-preferred-term anchor <a> with our custom element. */
        var my_re = /<a ng-if="\$ctrl.havePref".*?<\/a>/ig;
        var newTemplate = browseResultTemplate.replace(my_re,'<prm-custom-browse-link parent-ctrl="$ctrl" text="title" ng-if="$ctrl.havePref"></prm-custom-browse-link>');
        
        /* Replace the span-comma-span with a <br> break. (very brittle, I know.) */
        my_re = /<span ng-if="\!\$first">,<\/span>/ig;
        newTemplate = newTemplate.replace(my_re,'<br class="customCSCU" ng-if="!$first">');
        
        /* Add a break (<br>) before the word See: (very brittle, I know.) */
        my_re = /(<span ng-if="\$ctrl.havePref" translate="nui\.browse\.crossref\.see"><\/span>)/i;
        newTemplate = newTemplate.replace(my_re,'<br class="customCSCU" ng-if="$ctrl.havePref"/>$1');
       
        $templateCache.put(browseResultComponent, newTemplate);
          /* Update the browse-result template with our modified version. */
      }
  }]);
  /* End of Primo Browse page alteration. */ 

  /* Add a hyperlink for a Consortium-wide search */
  app.component('prmSearchResultListAfter', {
      template: '<div class="customCSCU spotlight-element margin-top-large layout-row" layout="row" id="customCSCU-consortium-search-card" ng-if="$ctrl.cscu_do_display()" ng-hide="$ctrl.parentCtrl.searchInProgress">' +
                ' <a href="{{$ctrl.cscu_consortium_search_href}}" alt title="{{$ctrl.cscu_hovertext}}">' +
                '  <div class="spotlight-image"><img alt src="custom/CENTRAL_PACKAGE/img/custom_icon_hierarchy.png"></div></a>' +
                ' <div class="spotlight-body customCSCU"><h3 class="spotlight-title">' +
                '  <a class="arrow-link bold-text md-primoExplore-theme" tabindex="0" href="{{$ctrl.cscu_consortium_search_href}}" title="{{$ctrl.cscu_hovertext}}"><span>{{$ctrl.cscu_link_text}}</span>' +
                '   <prm-icon link-arrow="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"><md-icon md-svg-icon="primo-ui:chevron-right" alt="" class="md-primoExplore-theme" aria-hidden="true"><svg id="chevron-right" width="100%" height="100%" viewBox="0 0 24 24" y="384" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>' +
                '   </svg></md-icon><prm-icon-after parent-ctrl="$ctrl"></prm-icon-after></prm-icon>' +
                '  </a></h3><p>{{$ctrl.cscu_long_description}}</p>' +
                '</div></div>' +
                '<div id="customCSCU-consortium-search-card-bottom-spacer"></div>',
      bindings: {parentCtrl: '<'},
      controller: 'customCSCU_prmSearchResultListAfter'
  });

  app.controller('customCSCU_prmSearchResultListAfter', ['$timeout', function($timeout) {
      var vm = this;
      var stParams = vm.parentCtrl.$stateParams;

      vm.cscu_link_text = 'Search all CSCU libraries';
      vm.cscu_hovertext = 'Perform this search across all CSCU libraries, plus the CT State Library';
      vm.cscu_long_description = 'Expand your search to include materials available all Connecticut Community College and State University libraries plus the State Library.';
      vm.cscu_consortium_search_href = 'search?query=' + stParams.query + 
        '&tab=' + stParams.tab + '&vid=' + stParams.vid + '&search_scope=CSCU';
      
      //vm.cscu_results = function() {
      //  return vm.parentCtrl.totalItems;
      //}
      vm.cscu_do_display = function() {
        var stateParams = vm.parentCtrl.$stateParams;
        if (   (stateParams.search_scope != 'CSCU') // Not already in the Consortium scope
            && (stateParams.query)
            && (stateParams.tab == 'default_tab') // Avoid the Browse/Journal search 
           ) {
          return true; 
        }
        return false; 
      }
      
  }]);
 /* MY CCSU SECTION - BANNER */
    app.component('ccsuBannerComponent',  {
        template: `<div style="width:100%; margin: auto; text-align: center;">See the <a href="https://libguides.ccsu.edu/fall2020">Fall 2020 Guide to Library Services</a> for CCSU's Elihu Burritt Library users</div>`
    })
    app.component('prmTopBarBefore', {
        bindings: {parentCtrl: `<`},
        template: `<ccsu-banner-component></ccsu-banner-component>`
    })
  /* END MY CCSU SECTION - BANNER */ 
})();