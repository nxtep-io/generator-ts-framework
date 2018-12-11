import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(UserModel.tableName)
export default class UserModel {
  private static readonly tableName = 'userss';

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: false })
  public name: string;

  public constructor(data: Partial<UserModel> = {}) {
    this.id = data.id;
    this.name = data.name;
  }

  /**
   * Finds user based on its name.
   */ 
  public static async findByName(name: string): Promise<UserModel | undefined> {
    return this.findOne({ where: {name} });
  }
}
