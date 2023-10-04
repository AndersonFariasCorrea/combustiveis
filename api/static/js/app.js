var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $(document).ready(() => {
        
    });
    $scope.years = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    $scope.tipos_combustiveis = ['disel', 'gás', 'gasolina'];
    $scope.estados = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"];
    $scope.municipios = ["Anapolis", "Goiânia", "Aparecida de Goiânia"];
    $scope.bairros = ["Morada do Sol", "Centro", "Centro Oeste", "Centro Sul"];
    $scope.medias = [{ano: 2014, cidade: "Goiânia", tipo: "gasolina", média_compra: 3.22, media_venda: 4.30}, {ano: 2014, cidade: "Aparecida Goiânia", tipo: "gasolina", média_compra: 3.52, media_venda: 4.90}]
});