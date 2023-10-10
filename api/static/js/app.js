var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.data = null;
    $(document).ready(function() {
        $scope.barChart({ anoFrom: 2009, produto: 'Gasolina' });
    });
    $scope.years = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    $scope.tipos_combustiveis = ['Disel', 'Gás', 'Gasolina'];
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

    $scope.yearIsGreaterFilter = function (year) {
        if (typeof $scope.combustivel?.yearFrom !== 'undefined') return year > $scope.combustivel.yearFrom;
    };

    $scope.barChart = (query) => {
        const ctx = document.getElementById('myChart');
        
        get('listarMediaPrecoPorAno', 'GET', query).then(function (result) {
            if (result) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: result.list.filter(item => item.sigla_uf).map(item => item.sigla_uf),
                        datasets: [{
                            label: '# Média de compra',
                            data: result.list.filter(item => item.preco_venda).map(item => item.preco_venda),
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
                $scope.data = result;
                $scope.$digest();
            } else {
                console.error('No list found in the response.');
            }
        })
        .catch(function (error) {
            // Handle errors here
            console.error('Error:', error);
        });
    };
    

    $scope.filter = () => {
        $scope.barChart({
            anoFrom: $scope.combustivel.yearFrom,
            anoTo: $scope.combustivel.yearTo,
            produto: $scope.combustivel.tipo
        });
    }
});