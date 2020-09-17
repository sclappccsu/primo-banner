
# Customize your Primo banner with an html block - e.g., for emergencies

This is a repository for the emergency banner code and documentation - institution view-specific.

See Word doc-based documentation explaining this addition of a banner to Primo that will allow institutions to add hyperlinks in, as well as an explanation of how we initially created a message only (CSS only)-based banner for the coronavirus emergency at https://github.com/sclappccsu/primo-banner/raw/master/Primo%20customizations%20notes_%20Emergency%20Banner.docx

* The custom.js needed for your Primo New UI's view template (belongs in js subfolder for a given view) is at https://github.com/sclappccsu/primo-banner/blob/master/custom.js

* The segment of css that you will need to add into your Primo New UI's view template's custom1.css (found in the css subfolder for a given view) is at https://github.com/sclappccsu/primo-banner/blob/master/custom1-segmentforbanner.css 
* Please note that this css addition can be added to the top of a view's template package's custom1.css - there are lines from MGH's css-only emergency banner that are now commented out (could likely be removed for cleanup). Lines 13-27 are the new css, including some special css to deal with style issues that arose in subcollections styling. 










