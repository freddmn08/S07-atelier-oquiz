var app = {
  uri: '',
  uriBack: '',

  init: function() {
    // je récupère ma base uri
    app.uri = $('.container').data('uri');
    app.uriBack = $('.container').data('back');
    $('form').on('submit', app.handleCheckForm);
  },

  handleCheckForm: function(evt) {
    evt.preventDefault();
    app.clearError();
    // je récupère les contenu des formulaire en retirant les espaces
    var data = {
      'email': $.trim($($(evt.target).find('.email')).val()),
      'password': $.trim($($(evt.target).find('.password')).val())
    };
    // par défaut je considère que des valeurs on été mis dans chaque input
    var notEmpty = true;
    // je vérifie qu'aucun input n'est vide
    for ( var index in data) 
    {
      // si vide j'affiche un message d'erreur
      // et je dis que notEmpty = false;
      if(data[index] == '') 
      {
        var textError = 'Vous ne pouvez pas laisser le champ '+ index +' vide.';
        var error = $('<div>').addClass('mx-auto my-2 border text-light bg-danger rounded p-2 error').html(textError);
        // j'ajoute le message au formulaire
        error.appendTo(evt.target);
        notEmpty = false;
      }
    }
    // si notEmpty = true, alors aucun input n'était vide
    if (notEmpty) 
    {
      // je lance la requête vers le back
      app.dataRequest(data);
    }
  },
  dataRequest: function(dataValue) {
    var jqxhr = $.ajax({
      url: 'http://localhost'+ app.uriBack +'/signin', 
      method: 'GET',
      dataType: 'json',
      data: {
        email: dataValue['email'],
        password: dataValue['password']
      }
    });
    // Je déclare la méthode done, celle-ci sera executée si la réponse est satisfaisante
    jqxhr.done(function (response) {
      // si success = true
      if (response.success) 
      {
        // j'affiche un message de succes
        app.displaySuccess();
      }
      // sinon 
      else 
      {
        // j'affiche le message d'erreur de l'index msg
        app.displayError(response.msg);
      }
    });
    // Je déclare la méthode fail, celle-ci sera executée si la réponse est insatisfaisante
    jqxhr.fail(function () {
      alert('Requête échouée');
    });
  },

  displaySuccess: function() {
    // je cache le formulaire
    $('form').addClass('d-none');

    var container = $('.container');
    // je créer la div qui contient mon message
    var div = $('<div>').addClass('row mx-auto col-11 my-3 border bg-light rounded py-2').html('Vous êtes bien connecté. <br/>Vous pouvez désormais jouer aux quizz ! Amusez vous bien.');
    // j'ajoute la div dans le container
    div.appendTo(container);

    // je cache les deux derniers liens de ma navbar (connexion et inscription)
    var allLi = $('ul.nav-pills li');
    $(allLi[1]).addClass('d-none');
    $(allLi[2]).addClass('d-none');
    // créer le lien déconnexion
    var liDisconnect = '<li class="nav-item">\
    <a class="nav-link text-blue" href="http://localhost'+ app.uri +'/connexion?disconnect=1">Deconnexion</a>\
    </li>';
    // puis l'ajoute au dom
    $(liDisconnect).appendTo($('ul.nav-pills'));
  },

  displayError: function(msg) {
    // j'affiche le message d'erreur en dessous du bouton Connexion
    var form = $('form');
    var error = $('<div>').addClass('mx-auto my-2 border text-light bg-danger rounded p-2 error').html(msg);
    
    error.appendTo(form);
  },

  clearError: function() {
    // s'il y a bien des messages d'erreur
    if(typeof $('.error') !== 'undefined')
    {
      $('.error').remove();
    }
  },
};
$(app.init);