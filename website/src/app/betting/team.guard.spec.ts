import { TestBed } from '@angular/core/testing';

import { TeamGuard } from './team.guard';

import { ConvertToSpacesPipe } from '../shared/convert-to-spaces.pipe';

describe('TeamGuard', () => {
  let guard: TeamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertToSpacesPipe ]
    });
    guard = TestBed.inject(TeamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
