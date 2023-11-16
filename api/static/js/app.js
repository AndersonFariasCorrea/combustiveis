var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.init = function () {
        $('.status-info').hide();
        $('body').show();
        $scope.charts = [];
        $scope.data = null;
        $scope.anoFrom = 2009;
        $scope.anoTo = 2023;
    }
    $scope.init();
    
    $(document).ready(function() {
        $scope.barChart({ anoFrom: 2009, produto: 'Gasolina' });

        get(`${endpoint}listaTiposCombustiveis`, 'GET', {
            'anoFrom': Math.min(...$scope.years),
            'anoTo': Math.max(...$scope.years)
        }).then(function (result) {
            $scope.tipos_combustiveis = result;
        });
        get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`, 'GET').then(function (result) {
            $scope.estados = result;
        });
    });
    
    $scope.years = [
        2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
    ];
    $scope.yearIsGreaterFilter = function (year) {
        if (typeof $scope.combustivel?.anoFrom !== 'undefined') return year > $scope.combustivel.anoFrom;
    };

    $scope.getCitiesByStates = (state) => {
        get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`, 'GET').then(function (result) {
            $scope.municipios = result;
            $scope.$digest();
        });
    }

    $scope.bairros = [
        "Morada do Sol", "Centro", "Centro Oeste", "Centro Sul"
    ];

    $scope.barChart = (query) => {
        
        const ctx = document.getElementById('myChart');
        if ($scope.charts['mediaPorAno']?.attached) $scope.charts['mediaPorAno'].destroy();
        
        get(`${endpoint}listarMediaPrecoPorAno`, 'GET', query).then(function (result) {
            if (result.length > 0 || Object.keys(result).length > 0) {
                if (! $('.status-info').hasClass('d-none')) {
                    $('.status-info').hide();
                    $('#myChart').show();
                }
                let label = 'nome_estabelecimento' in result.list[0] ? 'nome_estabelecimento' : 'sigla_uf'
                if ($scope?.combustiveL != undefined && 'nome' in $scope.combustivel?.municipio) 
                    label = result.list.filter(item => item).map(item => $scope.combustivel?.municipio.nome + ' ' + item.produto)
                else 
                    label = result.list.filter(item => item[label]).map(item => item[label] + ' ' + item.produto)
                
                $scope.charts['mediaPorAno'] = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: label,
                        datasets: [{
                            label: 'Média de compra',
                            data: result.list.filter(item => item.preco_venda).map(item => item.preco_venda),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                });
                $scope.data = result;
                $scope.$digest();
            } else {
                $('.status-info').show(500);
                $('#myChart').hide(1000);
                console.error('No list found in the response.');
            }
        }).catch(function (error) {
            // Handle errors here
            console.error('Error:', error);
        });
    };

    $scope.filter = () => {
        $scope.barChart({
            'anoFrom': $scope.combustivel?.anoFrom ?? '',
            'anoTo': $scope.combustivel?.anoTo ?? '',
            'produto': $scope.combustivel?.produto ?? '',
            'sigla_uf': $scope.combustivel.estado?.sigla ?? '',
            'id_municipio': $scope.combustivel?.municipio?.id ?? '',
            'bairro_revenda': $scope.combustivel?.bairro ?? '',       
            'cep_revenda': $scope.combustivel?.cep ?? '',
            'cnpj_revenda': $scope.combustivel?.cnpj ?? '',
            'unidade_medida': $scope.combustivel?.medida ?? '',
            'limit': $scope.combustivel?.queryLimit ?? ''
        });
    }
});