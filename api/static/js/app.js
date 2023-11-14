var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.init = function () {
        $('.status-info').hide();
        $('body').show();
    }

    $scope.init();
    $scope.charts = [];
    $scope.data = null;
    $scope.anoFrom = 2009;
    $scope.anoTo = 2023;
    
    $(document).ready(function() {
        $scope.barChart({ anoFrom: 2009, produto: 'Gasolina' });

        get('listaTiposCombustiveis', 'GET', {
            'anoFrom': Math.min(...$scope.years),
            'anoTo': Math.max(...$scope.years)
        }).then(function (result) {
            $scope.tipos_combustiveis = result;
        });
    });
    $scope.years = [
        2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
    ];
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
    $scope.bairros = [
        "Morada do Sol", "Centro", "Centro Oeste", "Centro Sul"
    ];
    $scope.yearIsGreaterFilter = function (year) {
        if (typeof $scope.combustivel?.anoFrom !== 'undefined') return year > $scope.combustivel.anoFrom;
    };

    $scope.barChart = (query) => {
        
        const ctx = document.getElementById('myChart');
        if ($scope.charts['mediaPorAno']?.attached) $scope.charts['mediaPorAno'].destroy();
        
        get('listarMediaPrecoPorAno', 'GET', query).then(function (result) {
            if (result.length > 0 || Object.keys(result).length > 0) {
                if (! $('.status-info').hasClass('d-none')) {
                    $('.status-info').hide();
                    $('#myChart').show();
                }
                let label = 'nome_estabelecimento' in result.list[0] ? 'nome_estabelecimento' : 'sigla_uf'
                $scope.charts['mediaPorAno'] = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: result.list.filter(item => item[label]).map(item => item[label] + ' ' + item.produto),
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
            'id_municipio': $scope.combustivel.estado?.id_municipio ?? '',
            'bairro_revenda': $scope.combustivel?.bairro ?? '',       
            'cep_revenda': $scope.combustivel?.cep ?? '',
            'cnpj_revenda': $scope.combustivel?.cnpj ?? '',
            'unidade_medida': $scope.combustivel?.medida ?? '',
            'limit': $scope.combustivel?.queryLimit ?? ''
        });
    }
});