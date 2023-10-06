var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.years = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    $scope.tipos_combustiveis = ['disel', 'gás', 'gasolina'];
    $scope.estados = [
        { nome: 'Acre', sigla: 'AC' },
        { nome: 'Alagoas', sigla: 'AL' },
        { nome: 'Amapá', sigla: 'AP' },
        { nome: 'Amazonas', sigla: 'AM' },
        { nome: 'Bahia', sigla: 'BA' },
        { nome: 'Ceará', sigla: 'CE' },
        { nome: 'Distrito Federal', sigla: 'DF' },
        { nome: 'Espírito Santo', sigla: 'ES' },
        { nome: 'Goiás', sigla: 'GO' },
        { nome: 'Maranhão', sigla: 'MA' },
        { nome: 'Mato Grosso', sigla: 'MT' },
        { nome: 'Mato Grosso do Sul', sigla: 'MS' },
        { nome: 'Minas Gerais', sigla: 'MG' },
        { nome: 'Pará', sigla: 'PA' },
        { nome: 'Paraíba', sigla: 'PB' },
        { nome: 'Paraná', sigla: 'PR' },
        { nome: 'Pernambuco', sigla: 'PE' },
        { nome: 'Piauí', sigla: 'PI' },
        { nome: 'Rio de Janeiro', sigla: 'RJ' },
        { nome: 'Rio Grande do Norte', sigla: 'RN' },
        { nome: 'Rio Grande do Sul', sigla: 'RS' },
        { nome: 'Rondônia', sigla: 'RO' },
        { nome: 'Roraima', sigla: 'RR' },
        { nome: 'Santa Catarina', sigla: 'SC' },
        { nome: 'São Paulo', sigla: 'SP' },
        { nome: 'Sergipe', sigla: 'SE' },
        { nome: 'Tocantins', sigla: 'TO' }
    ];
    $scope.bairros = ["Morada do Sol", "Centro", "Centro Oeste", "Centro Sul"];
    $scope.medias = [{ano: 2014, cidade: "Goiânia", tipo: "gasolina", média_compra: 3.22, media_venda: 4.30}, {ano: 2014, cidade: "Aparecida Goiânia", tipo: "gasolina", média_compra: 3.52, media_venda: 4.90}];

    $scope.yearIsGreaterFilter = function(year) {
        if (typeof $scope.combustivel?.yearFrom !== 'undefined') return year > $scope.combustivel.yearFrom;
    };

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: $scope.medias.filter(item => item.cidade).map(item => item.cidade),
            datasets: [{
            label: '# Média de compra',
            data: $scope.medias.filter(item => item.média_compra).map(item => item.média_compra),
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
    });
});