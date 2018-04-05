var ids = [];
$(document).ready(function(){
    $('.modal').modal();


    var commentsRef = db.ref('Maps/public');
    var i = 0;
    commentsRef.on('child_added', function(data) {
        $('#mainList').append("<li class='collection-item' onclick='publicMapJump("+i+")'>"+data.val().name+"</li>");
        ids.push(data.key);
        i++;
    });

    $('#buttonCreateMap').click(function(){
    //load animation

    });

    //tell the user whether the group name is taken
    $('#mapName').on('input', function(){
        checkNames($(this).val());
    });

    $('#isPublic').change(function(){
        checkNames($('#mapName').val());
    });
});

var map;

function publicMapJump(index){
    //alert("-"+ids[index]);
    window.localStorage.setItem("mapID",ids[index]);
    window.location.href = 'index.html';
}

function createMap(){
    //alert("****");
    var uluru = {lat: map.getCenter().lat(), lng: map.getCenter().lng()};
    var publicPrivate = $('#isPublic').is(":checked") ? 'public/' : 'private/';
    db.ref('Maps/' + publicPrivate).push().set({"name": $('#mapName').val(), "zoom":map.getZoom(), "center":uluru});
    //alert("center:"+map.getCenter().lat());
    //db.ref('Maps/public/').push().set({"name": $('#mapName').val(), "zoom":map.getZoom()});
}

function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    map = new google.maps.Map(document.getElementById('map'), {
                              zoom: 4,
                              center: uluru
                              });
    /*var marker = new google.maps.Marker({
     position: uluru,
     map: map
     });*/
}

function checkNames(mapName){
    var publicPrivate = $('#isPublic').is(":checked") ? 'public' : 'private';
    var mapField = $('#mapName');
    
    if(mapName){//check namespace for availability
        db.ref('Maps/' + publicPrivate + '/' + mapName).once('value').then(function(snapshot){
                                                                           
                                                                           if(snapshot.val()){
                                                                           mapField.removeClass('approved');
                                                                           mapField.addClass('taken');
                                                                           $('#takenHint').show();
                                                                           $('#takenHint>span').html(publicPrivate + ' maps.');
                                                                           }else{
                                                                           $('#takenHint').hide();
                                                                           mapField.removeClass('taken');
                                                                           mapField.addClass('approved');
                                                                           }
                                                                           });
    }else{//default state
        $('#takenHint').hide();
        mapField.removeClass('taken');
        mapField.removeClass('approved');
    }
}

