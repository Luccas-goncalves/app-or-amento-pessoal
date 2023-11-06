class Despesa{
	constructor(data, tipo, descricao, valor){
		this.data = data
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if (this[i] == undefined || this[i] == null || this[i] == '') {
				return false
			}
		}
		return true
	}
}

class Bd{
	constructor(){
		 let id = localStorage.getItem('id')
		 if (id === null) {
		 	localStorage.setItem('id', 0)
		 }
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId)+1 
	}

	gravar(d) {
	let id = this.getProximoId()	
	localStorage.setItem(id, JSON.stringify(d))
	localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){
		//array de despesas
		let despesas = Array()
		let id = localStorage.getItem('id')
		//for para recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))
			//verificar se existe a possibilidade de indíces que foram pulados ou removidos
			//nestes casos vamos pular esses indíces
			if(despesa === null){
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisarDespesa(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas)
		console.log(despesa)

		//data
		if (despesa.data != '') {
			console.log('filtro data')
			console.log(despesasFiltradas = despesasFiltradas.filter(d => d.data == despesa.data))
		}	
		//tipo
		if (despesa.tipo != '') {
			console.log('filtro tipo')
			console.log(despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo))	
		}
		//descricao
		if (despesa.descricao != '') {
			console.log('filtro descricao')
			console.log(despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao))	
		}
		//valor
		if (despesa.valor != '') {
			console.log('filtro valor')
			console.log(despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor))
		}		
			return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd =  new Bd()

function cadastrarDespesa() {
	const data = document.getElementById("data").value
	const tipo = document.getElementById("tipo").value
	const descricao = document.getElementById("descricao").value
	const valor = document.getElementById("valor").value

	const despesa = new Despesa(
		data,
		tipo, 
		descricao, 
		valor
		)

	if(despesa.validarDados()){
		bd.gravar(despesa)
		//dialog success
		$('#modalRegistraDespesa').modal('show')
		document.getElementById("titulo").className = "modal-title text-success"
		document.getElementById("titulo").innerHTML = "Sucesso na gravação"
		document.getElementById("feedback").innerHTML = "Gravação feita com sucesso!"
		document.getElementById("btn-descricao").className = "btn btn-success"
		document.getElementById("btn-descricao").innerHTML = "Voltar"
		this.data.value = ""
		this.tipo.value = "" 
		this.descricao.value = ""
		this.valor.value = ""
	}else{
		//dialog error
		$('#modalRegistraDespesa').modal('show')
		document.getElementById("titulo").className = "modal-title text-danger"
		document.getElementById("titulo").innerHTML = "Erro na gravação"
		document.getElementById("feedback").innerHTML = "Campos obrigatórios não preenchidos!"
		document.getElementById("btn-descricao").className = "btn btn-danger"
		document.getElementById("btn-descricao").innerHTML = "Voltar e corrigir"
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	if(despesas.length == 0 && filtro == false){
	despesas = bd.recuperarTodosRegistros()	
	}
	//selecionando elemento tbody
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''
	//percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(function (d) {
		//criando a linha (tr)
		let linha = listaDespesas.insertRow()
		//criando as colunas (td)
		linha.insertCell(0).innerHTML = d.data
		//ajustar o tipo
		switch(parseInt(d.tipo)){
		case 1: d.tipo = 'Moradia'
			break
		case 2: d.tipo = 'Educação'
			break
		case 3: d.tipo = 'Lazer'
			break
		case 4: d.tipo = 'Alimentação'
			break
		case 5: d.tipo = 'Investimento'
			break
		case 6: d.tipo = 'Transporte'
			break
		case 7: d.tipo = 'Extra'
			break	
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function () {
			//remover despesa
			//ajustar escrita do id
			let id = this.id.replace('id_despesa_','')

			bd.remover(id)
		    let row = this.parentNode.parentNode;
		    row.remove();
			$('#modalRegistraDespesa').modal('show')
			document.getElementById("titulo").className = "modal-title text-success"
			document.getElementById("titulo").innerHTML = "A despesa foi excluída com sucesso"
			document.getElementById("feedback").innerHTML = "Despesa excluída!"
			document.getElementById("btn-descricao").className = "btn btn-success"
			document.getElementById("btn-descricao").innerHTML = "Voltar"
		}
		linha.insertCell(4).append(btn)
	})
}

function pesquisarDespesa() {
  	let data = document.getElementById("data").value
  	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(data,tipo,descricao,valor)
	let despesas = bd.pesquisarDespesa(despesa)
	carregaListaDespesas(despesas, true)
}

function exibirModalAposExclusao() {
  // Código para exibir o modal
  $('#modalRegistraDespesa').modal('show');
  document.getElementById("titulo").className = "modal-title text-success"
  document.getElementById("titulo").innerHTML = "Sucesso na gravação"
  document.getElementById("feedback").innerHTML = "Gravação feita com sucesso!"
  document.getElementById("btn-descricao").className = "btn btn-success"
  document.getElementById("btn-descricao").innerHTML = "Voltar"
}

function valorTotalDespesas() {
	let total = Array()
	total = bd.recuperarTodosRegistros()
	let valorTotal = 0
	total.forEach(d =>{
	valorTotal += parseFloat(d.valor)
	valorTotal
	document.getElementById("valorTotal").innerHTML = `Valor total das despesas: ${valorTotal}`
	})
}

function getTotalTipo() {
	let total = Array()
	total = bd.recuperarTodosRegistros()
	let totais = {
	moradia: 0,
	educacao: 0,
	lazer: 0,
	alimentação: 0,
	investimento: 0,
	transporte: 0,
	extra: 0
	}
	total.forEach(d => {
		switch(parseInt(d.tipo)){
		case 1: totais.moradia += parseFloat(d.valor)
			break
		case 2: totais.educacao += parseFloat(d.valor)
			break
		case 3: totais.lazer += parseFloat(d.valor)
			break
		case 4: totais.alimentação += parseFloat(d.valor)
			break
		case 5: totais.investimento += parseFloat(d.valor)
			break
		case 6: totais.transporte += parseFloat(d.valor)
			break
		case 7: totais.extra += parseFloat(d.valor)
			break	
		}
	})
	return totais

}
	
const ctx = document.getElementById('grafico');
const totais = getTotalTipo()
let valoresX = [
	totais.moradia,
	totais.educacao,
	totais.lazer,
	totais.alimentação,
	totais.investimento,
	totais.transporte,
	totais.extra	
	]

new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Moradia', 'Educação', 'Lazer', 'Alimentação', 'Investimento', 'Transporte','Extra'],
      datasets: [{
        data: valoresX,
        hoverOffset: 5
      }]
    },
    options: {
   		
    }
  });