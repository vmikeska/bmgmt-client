import { Injectable } from "@angular/core";
import { ProjectChatMessagesEntity, ProjectEntity, ProjectParticipantEntity, ProjectsTaskEntity, TaskChatMessagesEntity, TaskEntity, TaskParticipantEntity, UserEntity, UserSettingsEntity, UserSkillsBindingEntity, UserSkillsTagEntity } from "./entities/entities";
import { EntityOperationsBase } from "./entity-operation-base";

@Injectable({ providedIn: 'root' })
export class ProjectEntityOperations extends EntityOperationsBase<ProjectEntity> {
  public get fullName() {
    return 'ProjectEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class TaskEntityOperations extends EntityOperationsBase<TaskEntity> {

  public get fullName() {
    return 'TaskEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class TaskParticipantEntityOperations extends EntityOperationsBase<TaskParticipantEntity> {

  public get fullName() {
    return 'TaskParticipantEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class ProjectParticipantEntityOperations extends EntityOperationsBase<ProjectParticipantEntity> {

  public get fullName() {
    return 'ProjectParticipantEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class ProjectsTaskEntityOperations extends EntityOperationsBase<ProjectsTaskEntity> {

  public get fullName() {
    return 'ProjectsTaskEntity';
  }

}


@Injectable({ providedIn: 'root' })
export class UserSettingsEntityOperations extends EntityOperationsBase<UserSettingsEntity> {

  public get fullName() {
    return 'UserSettingsEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class UserEntityOperations extends EntityOperationsBase<UserEntity> {

  public get fullName() {
    return 'UserEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class TaskChatMessagesEntityOperations extends EntityOperationsBase<TaskChatMessagesEntity> {

  public get fullName() {
    return 'TaskChatMessagesEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class ProjectChatMessagesEntityOperations extends EntityOperationsBase<ProjectChatMessagesEntity> {

  public get fullName() {
    return 'ProjectChatMessagesEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class UserSkillsBindingEntityOperations extends EntityOperationsBase<UserSkillsBindingEntity> {

  public get fullName() {
    return 'UserSkillsBindingEntity';
  }

}

@Injectable({ providedIn: 'root' })
export class UserSkillsTagEntityOperations extends EntityOperationsBase<UserSkillsTagEntity> {

  public get fullName() {
    return 'UserSkillsTagEntity';
  }

}



