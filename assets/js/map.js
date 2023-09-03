//Sample code written by August Li
var center = null;
var map = null;
var currentPopup;
var bounds = null;

function addMarker(lat, lng, info) {
    var icon = new google.maps.MarkerImage("assets/img/map_icon.png",
           	   new google.maps.Size(32, 32), new google.maps.Point(0, 0),
           	   new google.maps.Point(16, 32));

    var pt = new google.maps.LatLng(lat, lng);

    bounds = new google.maps.LatLngBounds();
    bounds.extend(pt);
    
    var marker = new google.maps.Marker({
        position: pt,
        icon: icon,
        map: map
    });
    
    var popup = new google.maps.InfoWindow({
        content: info,
        maxWidth: 300
    });

    google.maps.event.addListener(marker, "click", function() {
        if (currentPopup != null) {
            currentPopup.close();
            currentPopup = null;
        }
        popup.open(map, marker);
        currentPopup = popup;

        jQuery('.gm-style-iw').parent().addClass('infoBox');
        jQuery('.infoBox').children('div:first').addClass('hide');
        
        jQuery('.infoBox').parent('div').addClass('parentInfos');
		jQuery('.infoBox').find('img').attr('src', 'assets/img/close-map.png').css('margin', '5px');
    });

    google.maps.event.addListener(popup, "closeclick", function() {
        map.panTo(center);
        currentPopup = null;
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: new google.maps.LatLng(0, 0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        },
        navigationControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        }
    });

    jQuery.getJSON('pontos-mapa.php', function(data) {
        jQuery.each(data, function(index, el) {              	
            
            var infos = "<h2>" + data[index].regional + "</h2>" + 
                        "<span>" + data[index].endereco + "</span>" + 
                        "<span>" + data[index].complemento + "</span>" + 
                        "<span>" + data[index].cidade + "/" + data[index].estado + "</span>" + 
                        "<span>" + data[index].telefone + "</span>";

            addMarker(data[index].latitude, data[index].longitude, infos);

            bounds.extend(new google.maps.LatLng(data[index].latitude, data[index].longitude));
        });

        center = bounds.getCenter();
        //bounds = map.getBounds();

        //map.fitBounds(bounds);
        map.setCenter(center);
    });
    
    //addMarker(51.596490, -0.109514,'<span><strong>Roraima</strong> Salvador <br /> Av. Tancredo Neves, 1574 <br /> (71)3341.2477<span>');
    //center = bounds.getCenter();
    //map.fitBounds(bounds);
}