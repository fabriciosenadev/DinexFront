import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeedbackMessagesService {
  private readonly messages: any = {
    wallet: {
      createSuccess: 'Carteira criada com sucesso!',
      updateSuccess: 'Carteira atualizada com sucesso!',
      deleteSuccess: 'Carteira excluída com sucesso!',
      loadError: 'Erro ao carregar carteiras.',
      createError: 'Erro ao criar carteira.',
      updateError: 'Erro ao atualizar carteira.',
      deleteError: 'Erro ao excluir carteira.',
    },

    asset: {
      createSuccess: 'Ativo cadastrado com sucesso!',
      updateSuccess: 'Ativo atualizado com sucesso!',
      deleteSuccess: 'Ativo removido com sucesso!',
      loadError: 'Erro ao carregar ativos.',
      createError: 'Erro ao cadastrar ativo.',
      updateError: 'Erro ao atualizar ativo.',
      deleteError: 'Erro ao remover ativo.',
    },

    position: {
      createSuccess: 'Posição registrada com sucesso!',
      updateSuccess: 'Posição atualizada com sucesso!',
      deleteSuccess: 'Posição removida com sucesso!',
      loadError: 'Erro ao carregar posições.',
      createError: 'Erro ao registrar posição.',
      updateError: 'Erro ao atualizar posição.',
      deleteError: 'Erro ao remover posição.',
    },

    operation: {
      createSuccess: 'Operação realizada com sucesso!',
      updateSuccess: 'Operação atualizada com sucesso!',
      deleteSuccess: 'Operação removida com sucesso!',
      loadError: 'Erro ao carregar operações.',
      createError: 'Erro ao realizar operação.',
      updateError: 'Erro ao atualizar operação.',
      deleteError: 'Erro ao remover operação.',
    },

    user: {
      createSuccess: 'Usuário cadastrado com sucesso!',
      updateSuccess: 'Dados do usuário atualizados com sucesso!',
      deleteSuccess: 'Usuário removido com sucesso!',
      loadError: 'Erro ao carregar usuários.',
      createError: 'Erro ao cadastrar usuário.',
      updateError: 'Erro ao atualizar usuário.',
      deleteError: 'Erro ao remover usuário.',
    },

    auth: {
      loginSuccess: 'Login realizado com sucesso!',
      loginError: 'E-mail ou senha inválidos.',
      logoutSuccess: 'Logout efetuado com sucesso.',
    },

    broker: {
      createSuccess: 'Corretora cadastrada com sucesso!',
      updateSuccess: 'Corretora atualizada com sucesso!',
      deleteSuccess: 'Corretora removida com sucesso!',
      loadError: 'Erro ao carregar corretoras.',
      createError: 'Erro ao cadastrar corretora.',
      updateError: 'Erro ao atualizar corretora.',
      deleteError: 'Erro ao remover corretora.',
    },
  };

  get(entity: keyof typeof this.messages, key: string): string {
    return this.messages[entity]?.[key] || 'Operação realizada.';
  }
}
